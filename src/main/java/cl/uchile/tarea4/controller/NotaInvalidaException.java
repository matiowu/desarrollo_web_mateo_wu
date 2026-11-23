package cl.uchile.tarea4.controller;

public class NotaInvalidaException extends RuntimeException {

    public NotaInvalidaException(String mensaje) {
        super(mensaje);
    }
}