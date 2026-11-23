const input = document.getElementById("buscador");
const resultados = document.getElementById("resultados");
const mensaje = document.getElementById("mensaje");

document.getElementById("form-buscador").addEventListener("submit", function (evento) {
    evento.preventDefault();
});

input.addEventListener("input", buscar);

async function buscar() {
    const texto = input.value.trim();

    if (texto === "") {
        resultados.innerHTML = "";
        mensaje.textContent = "";
        return;
    }

    try {
        const respuesta = await fetch("/api/avistamientos?q=" + encodeURIComponent(texto));
        const avistamientos = await respuesta.json();

        if (texto !== input.value.trim()) {
            return;
        }

        mostrarResultados(avistamientos, texto);
    } catch (error) {
        mensaje.textContent = "Ocurrió un error al buscar.";
    }
}

function mostrarResultados(avistamientos, texto) {
    if (avistamientos.length === 0) {
        resultados.innerHTML = "";
        mensaje.textContent = "No se encontraron avistamientos para \"" + texto + "\".";
        return;
    }

    mensaje.textContent = "";

    let html = "<table>";
    html += "<tr><th>Voluntario</th><th>Día</th><th>Ave</th><th>Comuna</th><th>Nota</th><th>Evaluar</th></tr>";

    for (const a of avistamientos) {
        html += "<tr>";
        html += "<td>" + destacar(a.voluntario, texto) + "</td>";
        html += "<td>" + a.dia + "</td>";
        html += "<td>" + destacar(a.ave, texto) + "</td>";
        html += "<td>" + destacar(a.comuna, texto) + "</td>";
        html += "<td id=\"nota-" + a.id + "\">" + formatearNota(a.promedio) + "</td>";
        html += "<td id=\"evaluar-" + a.id + "\">" + botonEvaluar(a.id) + "</td>";
        html += "</tr>";
    }

    html += "</table>";
    resultados.innerHTML = html;
}

function formatearNota(promedio) {
    if (promedio === null) {
        return "-";
    }
    return promedio.toFixed(1);
}

function normalizar(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function destacar(texto, buscado) {
    const inicio = normalizar(texto).indexOf(normalizar(buscado));
    if (inicio === -1) {
        return escaparHTML(texto);
    }
    const fin = inicio + buscado.length;

    return escaparHTML(texto.slice(0, inicio))
        + "<mark>" + escaparHTML(texto.slice(inicio, fin)) + "</mark>"
        + escaparHTML(texto.slice(fin));
}

function escaparHTML(texto) {
    return texto
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;");
}

function botonEvaluar(id) {
    return "<button type=\"button\" onclick=\"mostrarSelector(" + id + ")\">Evaluar</button>";
}

function mostrarSelector(id) {
    let html = "<select id=\"select-" + id + "\" aria-label=\"Nota\">";
    html += "<option value=\"\">Nota</option>";
    for (let n = 1; n <= 7; n++) {
        html += "<option value=\"" + n + "\">" + n + "</option>";
    }
    html += "</select> ";
    html += "<button type=\"button\" onclick=\"enviarNota(" + id + ")\">Enviar</button>";

    document.getElementById("evaluar-" + id).innerHTML = html;
}

async function enviarNota(id) {
    const nota = Number(document.getElementById("select-" + id).value);

    if (!Number.isInteger(nota) || nota < 1 || nota > 7) {
        alert("Debes elegir una nota entre 1 y 7.");
        return;
    }

    try {
        const respuesta = await fetch("/api/avistamientos/" + id + "/notas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota: nota })
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.error);
            return;
        }

        document.getElementById("nota-" + id).textContent = formatearNota(datos.promedio);
        document.getElementById("evaluar-" + id).innerHTML = botonEvaluar(id);
    } catch (error) {
        alert("No se pudo enviar la nota.");
    }
}