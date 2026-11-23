package cl.uchile.tarea4.controller;

public class AvistamientoNoEncontradoException extends RuntimeException {

    public AvistamientoNoEncontradoException(Integer id) {
        super("No existe el avistamiento " + id);
    }
}
