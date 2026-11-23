package cl.uchile.tarea4.dto;

import java.time.LocalDate;


public record AvistamientoBusquedaDTO(
        Integer id,
        String voluntario,
        LocalDate dia,
        String ave,
        String comuna,
        Double promedio
) {
}
