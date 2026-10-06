# desarrollo_web_mateo_wu

## Tarea 1

### Consideraciones al momento de corregir:

- Se uso un array de ejemplo "avistamientosEjemplo" para poder mostrar la funcionalidad de las listas y grafico creados.
- Se decidió mantener el registro de avistamientos fuera del array de ejemplo "avistamientosEjemplo", esto debido a que todavía no se hace uso de una base de datos. Lo mismo ocurre con el registro de usuarios, donde solo queda un aviso de este registro. Se piensa a futuro usar un sistema de sesiones, donde al registrar un usuario, se puede hacer uso de las otras funciones de la aplicacion web
- Se creo la función DatosFiltrados(), la cual detecta si esta aplicado un filtro de tipo de ave y entrega una lista, y la función ordenar datos, que recibe esta lista (con el filtro activo o desactivado) y aplica los filtros por fecha o lugar. Se usan 2 funciones para poder aplicar ambos filtros simultáneamente. Ambas funciones se apoyan de filtroActivo y ordenActivo.
- Se crearon los gráficos mediante código Css, esto detectando la cantidad de avistamientos por cada tipo de ave y multiplicando este número por 40 px.
- Se aplicaron filtros a los datos ingresados por usuarios y avistamientos. Ya sea permiso de ingresar solo valores numéricos o alfabéticos. Otros con mínimo de caracteres. Por ejemplo las comunas tienen un mínimo de 4 caracteres (oficialmente no existen comunas de menos).

## Tarea 2

### Consideraciones al momento de corregir:

-. **Crear y activar el entorno virtual:**

   python3 -m venv venv
   source venv/bin/activate  # En Linux/macOS
   En Windows: venv\Scripts\activate

-. Instalación de dependencias

Instalar los paquetes requeridos especificados en `requirements.txt`:

pip install -r requirements.txt

-. Configuración de la base de datos: Asegurarse de que el servidor MySQL esté activo y que la base de datos tarea2 haya sido inicializada con las tablas y datos iniciales del script tarea2.sql:

mysql -u root -p < tarea2.sql

-. La aplicación utiliza la siguiente URI de conexión configurada en app.py:

mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2
