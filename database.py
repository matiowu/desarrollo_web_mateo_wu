from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select

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

