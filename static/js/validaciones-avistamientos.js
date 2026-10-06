document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('avistamiento');
    if (!form) return;

    function marcarError(idSpan, mensaje) {
        const span = document.getElementById(idSpan);
        span.textContent = mensaje;
        span.classList.toggle('visible', mensaje !== '');
        return mensaje === '';
    }

    function formatearFechaLocal(d) {
        const anio = d.getFullYear();
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const dia = String(d.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const valor = (id) => document.getElementById(id).value.trim();
        const archivos = Array.from(document.getElementById('archivos').files);

        const hoy = new Date();
        const minima = new Date(hoy.getTime() - 31 * 24 * 60 * 60 * 1000);
        const fecha = valor('fecha');
        const fechaOk = fecha !== '' &&
                        fecha >= formatearFechaLocal(minima) &&
                        fecha <= formatearFechaLocal(hoy);

        const archivosOk = archivos.length > 0 &&
            archivos.every(f => f.type.startsWith('image/') || f.type.startsWith('video/'));

        const resultados = [
            marcarError('error-voluntario',
                valor('voluntario_id') === '' ? 'Debe seleccionar el voluntario que reporta' : ''),
            marcarError('error-fecha',
                fechaOk ? '' : 'Debe ingresar una fecha válida (no futura y no mayor a un mes atrás)'),
            marcarError('error-hora',
                valor('hora') === '' ? 'Debe ingresar una hora válida' : ''),
            marcarError('error-lugar',
                valor('lugar').length < 2 ? 'Debe ingresar un lugar válido (mínimo 2 caracteres)' : ''),
            marcarError('error-ave',
                valor('ave_id') === '' ? 'Debe seleccionar un ave' : ''),
            marcarError('error-archivo',
                archivosOk ? '' : 'Debe adjuntar al menos una foto o video válido'),
        ];

        if (resultados.every(Boolean)) {
            form.submit();
        }
    });
});