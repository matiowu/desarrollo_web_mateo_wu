from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, select

db = SQLAlchemy()

class Region(db.Model):
    __tablename__ = "region"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)


class Comuna(db.Model):
    __tablename__ = "comuna"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey("region.id"), nullable=False)
    region = db.relationship("Region")


class Voluntario(db.Model):
    __tablename__ = "voluntario"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False)
    comuna_id = db.Column(db.Integer, db.ForeignKey("comuna.id"), nullable=False)
    comuna = db.relationship("Comuna")


class Ave(db.Model):
    __tablename__ = "ave"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)


class Avistamiento(db.Model):
    __tablename__ = "avistamiento"
    id = db.Column(db.Integer, primary_key=True)
    voluntario_id = db.Column(db.Integer, db.ForeignKey("voluntario.id"), nullable=False)
    ave_id = db.Column(db.Integer, db.ForeignKey("ave.id"), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False)
    lugar = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text)

    voluntario = db.relationship("Voluntario")
    ave = db.relationship("Ave")
    registros = db.relationship("Registro", backref="avistamiento")


class Registro(db.Model):
    __tablename__ = "registro"
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey("avistamiento.id"), nullable=False)

class Comentario(db.Model):
    __tablename__ = "comentario"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey("avistamiento.id"), nullable=False)

def get_regiones():
    return db.session.scalars(select(Region).order_by(Region.id)).all()

def get_comunas():
    return db.session.scalars(select(Comuna).order_by(Comuna.nombre)).all()

def get_comuna(comuna_id):
    return db.session.get(Comuna, comuna_id) if comuna_id else None

def get_voluntarios():
    return db.session.scalars(select(Voluntario).order_by(Voluntario.nombre)).all()

def get_voluntario(voluntario_id):
    return db.session.get(Voluntario, voluntario_id) if voluntario_id else None

def get_voluntario_or_404(voluntario_id):
    return db.get_or_404(Voluntario, voluntario_id)

def get_aves():
    return db.session.scalars(select(Ave).order_by(Ave.nombre)).all()

def get_ultimos_avistamientos(limite=2):
    return db.session.scalars(
        select(Avistamiento).order_by(Avistamiento.id.desc()).limit(limite)
    ).all()

def get_avistamientos_pagina(pagina, orden):
    consulta = select(Avistamiento)
    if orden == "lugar":
        consulta = consulta.order_by(Avistamiento.lugar)
    else:
        consulta = consulta.order_by(Avistamiento.fecha_hora.desc())
    return db.paginate(consulta, page=pagina, per_page=5, error_out=False)

def get_avistamiento_or_404(avistamiento_id):
    return db.get_or_404(Avistamiento, avistamiento_id)


def get_avistamientos_por_dia():
    dia = func.date(Avistamiento.fecha_hora)
    filas = db.session.execute(
        select(dia, func.count(Avistamiento.id)).group_by(dia).order_by(dia)
    ).all()
    return [(str(f[0]), f[1]) for f in filas]


def get_avistamientos_por_ave():
    filas = db.session.execute(
        select(Ave.nombre, func.count(Avistamiento.id))
        .join(Avistamiento, Avistamiento.ave_id == Ave.id)
        .group_by(Ave.id, Ave.nombre)
        .order_by(Ave.nombre)
    ).all()

    return [(f[0], f[1]) for f in filas]


def get_voluntarios_por_comuna():
    filas = db.session.execute(
        select(Comuna.nombre, func.count(Voluntario.id))
        .join(Voluntario, Voluntario.comuna_id == Comuna.id)
        .group_by(Comuna.id, Comuna.nombre)
        .order_by(Comuna.nombre)
    ).all()

    return [(f[0], f[1]) for f in filas]

def get_comentarios(avistamiento_id):
    return db.session.scalars(
        select(Comentario)
        .where(Comentario.avistamiento_id == avistamiento_id)
        .order_by(Comentario.fecha.desc(), Comentario.id.desc())
    ).all()


def create_comentario(datos):
    try:
        comentario = Comentario(**datos)
        db.session.add(comentario)
        db.session.commit()
        return comentario
    except Exception:
        db.session.rollback()
        raise


def create_voluntario(datos):
    try:
        voluntario = Voluntario(**datos)
        db.session.add(voluntario)
        db.session.commit()
        return voluntario
    except Exception:
        db.session.rollback()
        raise


def create_avistamiento(datos, registros):
    try:
        avistamiento = Avistamiento(**datos)
        db.session.add(avistamiento)
        db.session.flush()
        for r in registros:
            db.session.add(Registro(avistamiento_id=avistamiento.id, **r))
        db.session.commit()
        return avistamiento
    except Exception:
        db.session.rollback()
        raise