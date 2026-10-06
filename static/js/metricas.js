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

document.getElementById('total-avistamientos').textContent = avistamientosEjemplos.length;

const totalPorTipo = {};

for (const i of avistamientosEjemplos) {
    if (totalPorTipo[i.tipoAve]) {
        totalPorTipo[i.tipoAve]++;
    } else {
        totalPorTipo[i.tipoAve] = 1;
    }
}

const grafico = document.getElementById('grafico');

for (const i in totalPorTipo) {
    const cantidad = totalPorTipo[i];

    const fila = document.createElement('div');
    fila.className = 'fila-grafico';

    const etiqueta = document.createElement('span');
    etiqueta.className = 'etiqueta-barra';
    etiqueta.textContent = i + ' (' + cantidad + ')';

    const barra = document.createElement('div');
    barra.className = 'barra';
    barra.style.width = (cantidad * 40) + 'px';

    fila.appendChild(etiqueta);
    fila.appendChild(barra);
    grafico.appendChild(fila);
}