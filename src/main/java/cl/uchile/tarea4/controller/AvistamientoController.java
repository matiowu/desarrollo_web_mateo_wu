package cl.uchile.tarea4.controller;

import cl.uchile.tarea4.dto.AvistamientoBusquedaDTO;
import cl.uchile.tarea4.dto.PromedioDTO;
import cl.uchile.tarea4.model.Avistamiento;
import cl.uchile.tarea4.model.Nota;
import cl.uchile.tarea4.repository.AvistamientoRepository;
import cl.uchile.tarea4.repository.NotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avistamientos")
public class AvistamientoController {

    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public AvistamientoController(AvistamientoRepository avistamientoRepository,
                                  NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping
    public List<AvistamientoBusquedaDTO> buscar(
            @RequestParam(name = "q", defaultValue = "") String q) {

        String texto = q.trim();
        if (texto.isEmpty()) {
            return List.of();
        }

        return avistamientoRepository.buscar(texto)
                .stream()
                .map(this::aDTO)
                .toList();
    }

    @PostMapping("/{id}/notas")
    @ResponseStatus(HttpStatus.CREATED)
    public PromedioDTO agregarNota(@PathVariable Integer id,
                                   @RequestBody Map<String, Object> cuerpo) {

        Avistamiento avistamiento = avistamientoRepository.findById(id)
                .orElseThrow(() -> new AvistamientoNoEncontradoException(id));

        int nota = validarNota(cuerpo.get("nota"));

        notaRepository.save(new Nota(avistamiento, nota));

        Double promedio = notaRepository.promedioPorAvistamiento(id);
        return new PromedioDTO(id, promedio);
    }

    private int validarNota(Object valor) {
        if (!(valor instanceof Integer nota)) {
            throw new NotaInvalidaException("La nota debe ser un número entero entre 1 y 7");
        }
        if (nota < 1 || nota > 7) {
            throw new NotaInvalidaException("La nota debe estar entre 1 y 7");
        }
        return nota;
    }

    private AvistamientoBusquedaDTO aDTO(Avistamiento a) {
        return new AvistamientoBusquedaDTO(
                a.getId(),
                a.getVoluntario().getNombre(),
                a.getFechaHora().toLocalDate(),
                a.getAve().getNombre(),
                a.getVoluntario().getComuna().getNombre(),
                notaRepository.promedioPorAvistamiento(a.getId())
        );
    }
}