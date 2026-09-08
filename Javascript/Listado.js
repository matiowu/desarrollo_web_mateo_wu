const avistamientosEjemplos = [
{
    tipoAve: 'rapaz',
    nombreAve: 'Águila',
    lugar: 'Montaña',
    cantidad: 1,
    hora: '10:00',
    fecha: '2023-10-01'
},
{
    tipoAve: 'acuatica',
    nombreAve: 'Pato',
    lugar: 'Lago',
    cantidad: 5,
    hora: '14:30',
    fecha: '2023-10-02'
},
{
    tipoAve: 'paseriforme',
    nombreAve: 'Canario',
    lugar: 'Jardín',
    cantidad: 3,
    hora: '09:15',
    fecha: '2023-10-03'
},
{
    tipoAve: 'paseriforme',
    nombreAve: 'Canario',
    lugar: 'Lago',
    cantidad: 6,
    hora: '09:15',
    fecha: '2022-02-25'
},
{
    tipoAve: 'rapaz',
    nombreAve: 'Águila',
    lugar: 'Montaña',
    cantidad: 1,
    hora: '10:00',
    fecha: '2023-10-01'
},
{
    tipoAve: 'acuatica',
    nombreAve: 'Pato',
    lugar: 'Lago',
    cantidad: 5,
    hora: '14:30',
    fecha: '2023-10-02'
},
{
    tipoAve: 'paseriforme',
    nombreAve: 'Canario',
    lugar: 'Jardín',
    cantidad: 3,
    hora: '09:15',
    fecha: '2023-10-03'
},
{
    tipoAve: 'paseriforme',
    nombreAve: 'Canario',
    lugar: 'Lago',
    cantidad: 6,
    hora: '09:15',
    fecha: '2022-02-25'
},
{
    tipoAve: 'rapaz',
    nombreAve: 'Águila',
    lugar: 'Montaña',
    cantidad: 1,
    hora: '10:00',
    fecha: '2023-10-01'
},
{
    tipoAve: 'acuatica',
    nombreAve: 'Pato',
    lugar: 'Lago',
    cantidad: 5,
    hora: '14:30',
    fecha: '2023-10-02'
},
{
    tipoAve: 'paseriforme',
    nombreAve: 'Canario',
    lugar: 'Jardín',
    cantidad: 3,
    hora: '09:15',
    fecha: '2023-10-03'
},
{
    tipoAve: 'paseriforme',
    nombreAve: 'Canario',
    lugar: 'Lago',
    cantidad: 6,
    hora: '09:15',
    fecha: '2022-02-25'
}

]

function seccionar(array, tamañoSeccion) {
    const secciones = [];

    for (let i = 0; i < array.length; i += tamañoSeccion) {
        secciones.push(array.slice(i, i + tamañoSeccion));
    }
    return secciones;
}

let paginaActual = 0;
function CrearLista(datos){
    const resultados = document.getElementById('Lista');
    resultados.innerHTML = '';

    const paginas = seccionar(datos, 5);
    const estaPagina = paginas[paginaActual];
    for (const i of estaPagina){
        const div = document.createElement('div');
        div.className = 'avistamiento-item';

        const spanNombre = document.createElement('span');
        spanNombre.className = 'nombre';
        spanNombre.textContent = i.nombreAve + ' ';

        const spanTipo = document.createElement('span');
        spanTipo.className = 'tipo';
        spanTipo.textContent = i.tipoAve;

        const spanFecha = document.createElement('span');
        spanFecha.className = 'fecha';
        spanFecha.textContent = ' — ' + i.fecha;

        const spanLugar = document.createElement('span');
        spanLugar.className = 'lugar';
        spanLugar.textContent = ' en ' + i.lugar;

        div.appendChild(spanNombre);

        div.appendChild(spanTipo);
        div.appendChild(spanFecha);
        div.appendChild(spanLugar);

        resultados.appendChild(div);

    }

}

let ordenActivo = '';
function ordenarDatos() {
    const copiarArray = [...DatosFiltrados()];
    if (ordenActivo === 'fecha') {
        copiarArray.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } else if (ordenActivo === 'lugar') {
        copiarArray.sort((a, b) => a.lugar.localeCompare(b.lugar));
    }
    return copiarArray;
}

document.getElementById('ordenar-fecha').addEventListener('click', function() {
    ordenActivo = 'fecha';
    paginaActual = 0;
    CrearLista(ordenarDatos());
});


document.getElementById('ordenar-lugar').addEventListener('click', function() {
    ordenActivo = 'lugar';
    paginaActual = 0;
    CrearLista(ordenarDatos());
});



let filtroActivo = '';

function DatosFiltrados() {
    let filtrados;
    if (filtroActivo === '') {
        filtrados = avistamientosEjemplos;
    } else {
        filtrados = avistamientosEjemplos.filter(a => a.tipoAve === filtroActivo);
    }
    return filtrados;
}

document.getElementById('filtro-aves').addEventListener('change', function() {
    filtroActivo = this.value;
    paginaActual = 0;
    CrearLista(ordenarDatos());
});

document.getElementById('siguienteLista').addEventListener('click', function() {
    const totalPaginas = seccionar(ordenarDatos(), 5).length;
    if (paginaActual < totalPaginas - 1) {
        paginaActual++;
        CrearLista(ordenarDatos());
    }
});

document.getElementById('anteriorLista').addEventListener('click', function() {
    if (paginaActual > 0) {
        paginaActual--;
        CrearLista(ordenarDatos());
    }
});

CrearLista(avistamientosEjemplos);