const formRegistro = document.getElementById('registro');

formRegistro.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('email').value.trim();
    const region = document.getElementById('region').value.trim();
    const comuna = document.getElementById('comuna').value.trim();

    let valido = true;

    const nombreError = document.getElementById('error-nombre');
    if (nombre === '' || nombre.length < 2 || !/^[a-zA-Z\s]+$/.test(nombre)) {
        nombreError.textContent = 'Debe ingresar un nombre (mínimo 2 caracteres)';
        nombreError.classList.add('visible');
        valido = false;
    } else {
        nombreError.classList.remove('visible');
    }

    const regionError = document.getElementById('error-region');
    if (region === '') {
        regionError.textContent = 'Debe seleccionar una región';
        regionError.classList.add('visible');
        valido = false;
    } else {
        regionError.classList.remove('visible');
    }

    const comunaError = document.getElementById('error-comuna');
    if (comuna === '' || comuna.length < 4 || !/^[a-zA-Z\s]+$/.test(comuna)) {
        comunaError.textContent = 'Debe ingresar una comuna válida (mínimo 4 caracteres)';
        comunaError.classList.add('visible');
        valido = false;
    } else {
        comunaError.classList.remove('visible');
    }

    const correoError = document.getElementById('error-mail');
    if (correo === '') {
        correoError.textContent = 'Debe ingresar un email válido';
        correoError.classList.add('visible');
        valido = false;
    } else {
        correoError.classList.remove('visible');
    }

    if (!valido) {
        return;
    }

    alert('usuario registrado correctamente');
    formRegistro.reset();
});




