import os
import re
import uuid
from datetime import date, datetime, timedelta

from flask import Flask, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

from database import (
    db,
    create_avistamiento, create_voluntario,
    get_aves, get_avistamiento_or_404, get_avistamientos_pagina,
    get_comuna, get_comunas, get_regiones,
    get_ultimos_avistamientos, get_voluntario, get_voluntario_or_404, get_voluntarios,
)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "cambiar-en-produccion")
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2"
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024
db.init_app(app)

EXTENSIONES_PERMITIDAS = {"png", "jpg", "gif", "webp", "mp4", "webm"}
CARPETA_SUBIDAS = os.path.join(app.static_folder, "uploads")
os.makedirs(CARPETA_SUBIDAS, exist_ok=True)

def validar_voluntario(form):
    errores, limpio = {}, {}

    nombre = form.get("nombre", "").strip()
    if not re.fullmatch(r"[A-Za-zÁÉÍÓÚÜáéíóúüÑñ ]{2,255}", nombre):
        errores["nombre"] = "Debe ingresar un nombre válido (2 a 255 caracteres, solo letras)."
    else:
        limpio["nombre"] = nombre

    region_id = form.get("region_id", type=int)
    if not region_id:
        errores["region"] = "Debe seleccionar una región válida."

    comuna = get_comuna(form.get("comuna_id", type=int))
    if comuna is None:
        errores["comuna"] = "Debe seleccionar una comuna válida."
    elif comuna.region_id != region_id:
        errores["comuna"] = "La comuna no pertenece a la región seleccionada."
    else:
        limpio["comuna_id"] = comuna.id

    email = form.get("email", "").strip()
    if len(email) > 80 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        errores["email"] = "Debe ingresar un email válido (máximo 80 caracteres)."
    else:
        limpio["email"] = email

    telefono = form.get("telefono", "").strip()
    if not re.fullmatch(r"(?=.{8,15}$)\+?[0-9]+", telefono):
        errores["telefono"] = "Debe ingresar un número válido (8 a 15 caracteres, ej: +56912345678)."
    else:
        limpio["telefono"] = telefono

    return errores, limpio


def tipo_archivo(archivo):
    cabecera = archivo.stream.read(32)
    archivo.stream.seek(0)

    if not cabecera:
        return None

    if cabecera.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if cabecera.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if cabecera.startswith(b"GIF87a") or cabecera.startswith(b"GIF89a"):
        return "gif"
    if cabecera.startswith(b"RIFF") and cabecera[8:12] == b"WEBP":
        return "webp"
    if len(cabecera) >= 12 and cabecera[4:8] == b"ftyp":
        return "mp4"
    if cabecera.startswith(b"\x1a\x45\xdf\xa3"):
        return "webm"

    return None


def validar_avistamiento(form, archivos):
    errores, limpio = {}, {}

    voluntario = get_voluntario(form.get("voluntario_id", type=int))
    if voluntario is None:
        errores["voluntario"] = "Debe seleccionar un voluntario válido."
    else:
        limpio["voluntario_id"] = voluntario.id

    ave_id = form.get("ave_id", type=int)
    if not ave_id:
        errores["ave"] = "Debe seleccionar un ave válida."
    else:
        limpio["ave_id"] = ave_id

    lugar = form.get("lugar", "").strip()
    if not 2 <= len(lugar) <= 200:
        errores["lugar"] = "El lugar debe tener entre 2 y 200 caracteres."
    else:
        limpio["lugar"] = lugar

    fecha = hora = None
    try:
        fecha = datetime.strptime(form.get("fecha", ""), "%Y-%m-%d").date()
        hoy = date.today()
        if fecha > hoy or fecha < hoy - timedelta(days=31):
            errores["fecha"] = "La fecha no puede ser futura ni de hace más de un mes."
    except ValueError:
        errores["fecha"] = "Fecha inválida."

    try:
        hora = datetime.strptime(form.get("hora", ""), "%H:%M").time()
    except ValueError:
        errores["hora"] = "Hora inválida."

    if "fecha" not in errores and "hora" not in errores:
        limpio["fecha_hora"] = datetime.combine(fecha, hora)

    descripcion = form.get("descripcion", "").strip()
    if len(descripcion) > 500:
        errores["descripcion"] = "La descripción no puede superar los 500 caracteres."
    limpio["descripcion"] = descripcion or None

    if not archivos:
        errores["archivos"] = "Debe adjuntar al menos una foto o video."
    elif any(tipo_archivo(a) is None for a in archivos):
        errores["archivos"] = "Solo se permiten imágenes (png, jpg, gif, webp) o videos (mp4, webm) válidos."

    return errores, limpio

def guardar_archivos(archivos):
    guardados = []
    for archivo in archivos:
        nombre = f"{uuid.uuid4().hex}.{tipo_archivo(archivo)}"
        archivo.save(os.path.join(CARPETA_SUBIDAS, nombre))
        guardados.append({
            "ruta_archivo": f"uploads/{nombre}",
            "nombre_archivo": secure_filename(archivo.filename) or nombre,
        })
    return guardados


def borrar_archivos(registros):
    for r in registros:
        try:
            os.remove(os.path.join(app.static_folder, r["ruta_archivo"]))
        except OSError:
            pass

@app.route("/")
def index():
    return render_template("portada.html", ultimos=get_ultimos_avistamientos(limite=2))


@app.route("/voluntario/nuevo", methods=["GET", "POST"])
def registrar_voluntario():
    def mostrar(datos, errores):
        return render_template("usuario.html", regiones=get_regiones(), comunas=get_comunas(), datos=datos, errores=errores)

    if request.method == "GET":
        return mostrar({}, {})

    errores, limpio = validar_voluntario(request.form)
    if errores:
        return mostrar(request.form.to_dict(), errores)

    try:
        voluntario = create_voluntario({**limpio, "fecha_registro": datetime.now()})
    except Exception:
        flash("Ocurrió un error al guardar el registro.", "error")
        return mostrar(request.form.to_dict(), {})

    return redirect(url_for("voluntario_registrado", id=voluntario.id))


@app.route("/voluntario/<int:id>/registrado")
def voluntario_registrado(id):
    return render_template("voluntario_registrado.html", voluntario=get_voluntario_or_404(id))


@app.route("/avistamiento/nuevo", methods=["GET", "POST"])
def registrar_avistamiento():
    def mostrar(datos, errores):
        return render_template("avistamiento.html", voluntarios=get_voluntarios(), aves=get_aves(), datos=datos, errores=errores)

    if request.method == "GET":
        return mostrar({"voluntario_id": request.args.get("voluntario_id", "")}, {})

    archivos = [a for a in request.files.getlist("archivos") if a.filename]
    errores, limpio = validar_avistamiento(request.form, archivos)
    if errores:
        return mostrar(request.form.to_dict(), errores)

    guardados = []
    try:
        guardados = guardar_archivos(archivos)
        create_avistamiento(limpio, guardados)
    except Exception:
        borrar_archivos(guardados)
        flash("Ocurrió un error al guardar el avistamiento.", "error")
        return mostrar(request.form.to_dict(), {})

    flash("Avistamiento registrado correctamente ✔", "success")
    return redirect(url_for("index"))


@app.route("/listado")
def listado_avistamientos():
    pagina = request.args.get("pagina", 1, type=int)
    orden = "lugar" if request.args.get("orden") == "lugar" else "fecha"
    paginacion = get_avistamientos_pagina(pagina, orden)
    return render_template("listado.html", paginacion=paginacion, orden=orden)


@app.route("/avistamiento/<int:id>")
def detalle_avistamiento(id):
    return render_template("detalle.html", a=get_avistamiento_or_404(id))


@app.route("/metricas")
def metricas():
    return render_template("graficos.html")


if __name__ == "__main__":
    app.run(debug=True, port=5001)

