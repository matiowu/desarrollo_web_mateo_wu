package cl.uchile.tarea4.repository;

import cl.uchile.tarea4.model.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("""
            SELECT a FROM Avistamiento a
            JOIN FETCH a.voluntario v
            JOIN FETCH v.comuna c
            JOIN FETCH a.ave av
            WHERE LOWER(av.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))
               OR LOWER(v.nombre)  LIKE LOWER(CONCAT('%', :texto, '%'))
               OR LOWER(c.nombre)  LIKE LOWER(CONCAT('%', :texto, '%'))
            ORDER BY a.fechaHora DESC
            """)
    List<Avistamiento> buscar(@Param("texto") String texto);
}