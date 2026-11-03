async function pedirDatos(id) {
    const url = document.getElementById(id).dataset.url;
    const respuesta = await fetch(url);
    return await respuesta.json();
}

async function dibujarGraficos() {
    const dia = await pedirDatos("grafico-dia");
    document.getElementById("total-avistamientos").textContent = dia.valores.reduce((a, b) => a + b, 0);
    Highcharts.chart("grafico-dia", {
        chart: { type: "line" },
        title: { text: "Avistamientos por día" },
        xAxis: { categories: dia.labels, title: { text: "Día" } },
        yAxis: { allowDecimals: false, title: { text: "Cantidad de avistamientos" } },
        series: [{ name: "Avistamientos", data: dia.valores }]
    });

    const ave = await pedirDatos("grafico-ave");
    Highcharts.chart("grafico-ave", {
        chart: { type: "pie" },
        title: { text: "Avistamientos por tipo de ave" },
        series: [{ name: "Avistamientos", data: ave.labels.map((nombre, i) => [nombre, ave.valores[i]]) }]
    });

    const comuna = await pedirDatos("grafico-comuna");
    Highcharts.chart("grafico-comuna", {
        chart: { type: "column" },
        title: { text: "Voluntarios por comuna" },
        xAxis: { categories: comuna.labels, title: { text: "Comuna" } },
        yAxis: { allowDecimals: false, title: { text: "Cantidad de voluntarios" } },
        legend: { enabled: false },
        series: [{ name: "Voluntarios", data: comuna.valores }]
    });
}

dibujarGraficos();