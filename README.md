# Tarea 4

## Requisitos

- Java 21
- MySQL con la base de datos `tarea2` (usuario `cc5002`, contraseña `programacionweb`)

## Cómo correr el proyecto

1. Crear la tabla `nota` en la base de datos:

   ```bash
   mysql -u cc5002 -p tarea2 < tabla-nota.sql
   ```

2. Iniciar la aplicación desde la raíz del proyecto:

   ```bash
   ./mvnw spring-boot:run
   ```

   En Windows:

   ```bash
   mvnw.cmd spring-boot:run
   ```

3. Abrir en el navegador: http://localhost:8080
