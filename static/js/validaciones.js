document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro');
    if (!form) return;

    const selRegion = document.getElementById('region');
    const selComuna = document.getElementById('comuna');
    const todasLasComunas = Array.from(selComuna.querySelectorAll('option[data-region]'));

    function cargarComunas(regionId, seleccionada = '') {
        selComuna.length = 1;
        for (const opcion of todasLasComunas) {
            if (opcion.dataset.region === regionId) {
                selComuna.append(opcion);
            }
        }
        selComuna.value = seleccionada;
        if (selComuna.value !== seleccionada) selComuna.selectedIndex = 0;
    }

    selRegion.addEventListener('change', () => cargarComunas(selRegion.value));
    cargarComunas(selRegion.value, selComuna.dataset.seleccionada || '');

    function marcarError(idSpan, mensaje) {
        const span = document.getElementById(idSpan);
        span.textContent = mensaje;
        span.classList.toggle('visible', mensaje !== '');
        return mensaje === '';
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const valor = (id) => document.getElementById(id).value.trim();
        const nombre = valor('nombre');
        const correo = valor('email');
        const telefono = valor('telefono');

        const nombreOk = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]{2,255}$/.test(nombre);
        const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && correo.length <= 80;
        const telefonoOk = /^(?=.{8,15}$)\+?[0-9]+$/.test(telefono);

        const resultados = [
            marcarError('error-nombre',
                nombreOk ? '' : 'Debe ingresar un nombre válido (mínimo 2 caracteres, solo letras)'),
            marcarError('error-region',
                valor('region') === '' ? 'Debe seleccionar una región' : ''),
            marcarError('error-comuna',
                valor('comuna') === '' ? 'Debe seleccionar una comuna válida' : ''),
            marcarError('error-mail',
                correoOk ? '' : 'Debe ingresar un email válido (ej: usuario@correo.com)'),
            marcarError('error-telefono',
                telefonoOk ? '' : 'Debe ingresar un número válido (8 a 15 caracteres, ej: +56912345678)'),
        ];

        if (resultados.every(Boolean)) {
            form.submit();
        }
    });
});