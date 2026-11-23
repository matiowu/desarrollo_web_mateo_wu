package cl.uchile.tarea4.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ErrorAdvice {

    @ExceptionHandler(AvistamientoNoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> avistamientoNoEncontrado(AvistamientoNoEncontradoException e) {
        return Map.of("error", e.getMessage());
    }

    @ExceptionHandler(NotaInvalidaException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> notaInvalida(NotaInvalidaException e) {
        return Map.of("error", e.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> jsonInvalido(HttpMessageNotReadableException e) {
        return Map.of("error", "Se esperaba un JSON con la forma {\"nota\": 5}");
    }
}