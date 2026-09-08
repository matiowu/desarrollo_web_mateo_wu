const formAvistamiento = document.getElementById('avistamiento');

formAvistamiento.addEventListener('submit', function(event) {
    event.preventDefault();

    const tipoAve = document.getElementById('tipo-ave').value.trim();
    const nombreAve = document.getElementById('nombre-ave').value.trim();
    const lugar = document.getElementById('lugar').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const hora = document.getElementById('hora').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const archivo = document.getElementById('archivo').files;

    let valido = true;

    const fechaError = document.getElementById('error-fecha');
    const hoy = new Date()
    const unMesAtras = new Date();

    unMesAtras.setMonth(hoy.getMonth() - 1);
    const fechaMinima = unMesAtras.toISOString().split('T')[0];
    const fechaMaxima = hoy.toISOString().split('T')[0];
    if (fecha === '' || fecha < fechaMinima || fecha > fechaMaxima) {
        fechaError.textContent = 'Debe ingresar una fecha valida (no más de un mes atrás y no futura)';
        fechaError.classList.add('visible');
        valido = false;
    } else {
        fechaError.classList.remove('visible');
    }

    const horaError = document.getElementById('error-hora');
    if (hora === '') {
        horaError.textContent = 'Debe ingresar una hora valida';
        horaError.classList.add('visible');
        valido = false;
    } else {
        horaError.classList.remove('visible');
    }

    const lugarError = document.getElementById('error-lugar');
    if (lugar === '' || lugar.length < 2) {
        lugarError.textContent = 'Debe ingresar un lugar (minimo 2 caracteres)';
        lugarError.classList.add('visible');
        valido = false;
    } else {
        lugarError.classList.remove('visible');
    }

    const tipoAveError = document.getElementById('error-tipo-ave');
    if (tipoAve === '') {
        tipoAveError.textContent = 'Debe seleccionar un tipo de ave';
        tipoAveError.classList.add('visible');
        valido = false;
    } else {
        tipoAveError.classList.remove('visible');
    }

    const nombreAveError = document.getElementById('error-nombre-ave');
    if (nombreAve === '' || nombreAve.length < 2 || !/^[a-zA-Z\s]+$/.test(nombreAve)) {
        nombreAveError.textContent = 'Debe ingresar el nombre del ave (minimo 2 caracteres)';
        nombreAveError.classList.add('visible');
        valido = false;
    } else {
        nombreAveError.classList.remove('visible');
    }

    const cantidadError = document.getElementById('error-cantidad');
    if (cantidad === '' || isNaN(cantidad) || cantidad <= 0) {
        cantidadError.textContent = 'Debe ingresar una cantidad válida';
        cantidadError.classList.add('visible');
        valido = false;
    } else {
        cantidadError.classList.remove('visible');
    }

    const archivoValido = Array.from(archivo).every(file => file.type.startsWith('image/') || file.type.startsWith('video/'));
    const archivoError = document.getElementById('error-archivo');
    if (archivo.length === 0 || !archivoValido) {
        archivoError.textContent = 'Debe adjuntar al menos una foto o video';
        archivoError.classList.add('visible');
        valido = false;
    } else {
        archivoError.classList.remove('visible');
    }

    if (!valido) {
        return;
    }

    alert('Avistamiento registrado correctamente');
    formAvistamiento.reset();
});