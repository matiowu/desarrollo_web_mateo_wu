const formulario = document.getElementById("form-comentario");
const campoNombre = document.getElementById("nombre-comentario");
const campoTexto = document.getElementById("texto-comentario");
const boton = document.getElementById("btn-comentario");
const lista = document.getElementById("lista-comentarios");
const url = lista.dataset.url;

async function cargarComentarios() {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error("Error " + respuesta.status);
        }
        const comentarios = await respuesta.json();

        lista.textContent = "";

        if (comentarios.length === 0) {
            const p = document.createElement("p");
            p.textContent = "Aún no hay comentarios.";
            lista.appendChild(p);
            return;
        }

        const ul = document.createElement("ul");
        for (const c of comentarios) {
            const li = document.createElement("li");

            const cabecera = document.createElement("strong");
            cabecera.textContent = c.nombre + " (" + c.fecha + ")";

            const texto = document.createElement("p");
            texto.textContent = c.texto;

            li.appendChild(cabecera);
            li.appendChild(texto);
            ul.appendChild(li);
        }
        lista.appendChild(ul);
    } catch (error) {
        lista.textContent = "No se pudieron cargar los comentarios.";
    }
}

function validar(nombre, texto) {
    const errores = {};
    if (nombre.length < 3 || nombre.length > 50) {
        errores.nombre = "El nombre debe tener entre 3 y 50 caracteres.";
    }
    if (texto.length < 5 || texto.length > 300) {
        errores.texto = "El comentario debe tener entre 5 y 300 caracteres.";
    }
    return errores;
}

function mostrarErrores(errores) {
    for (const campo of ["nombre", "texto", "general"]) {
        document.getElementById("error-" + campo).textContent = errores[campo] || "";
    }
}

boton.addEventListener("click", async () => {
    const errores = validar(campoNombre.value.trim(), campoTexto.value.trim());
    mostrarErrores(errores);
    if (Object.keys(errores).length > 0) {
        return;
    }

    boton.disabled = true;
    try {
        const respuesta = await fetch(url, {
            method: "POST",
            body: new FormData(formulario)
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarErrores(datos.errores || { general: "No se pudo guardar el comentario." });
            return;
        }

        formulario.reset();
        await cargarComentarios();
    } catch (error) {
        mostrarErrores({ general: "No se pudo enviar el comentario. Intenta de nuevo." });
    } finally {
        boton.disabled = false;
    }
});

cargarComentarios();