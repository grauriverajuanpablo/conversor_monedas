let miGrafico = null;

document.getElementById('buscar').addEventListener('click', async () => {
    const pesosInput = parseFloat(document.getElementById('pesosclp').value);
    const selecionavalor = document.getElementById('monedas').value;

    try {
        const response = await fetch(`https://mindicador.cl/api/${selecionavalor}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos. Inténtalo nuevamente.');
        }
        const data = await response.json();
        const conversion = data.serie[0].valor;

        let convierte = parseFloat(pesosInput) / conversion;

        document.getElementById('result').textContent = `Resultado: $${convierte.toFixed(0)} ${selecionavalor.toUpperCase()}`;
        imprimirResultado(data);
    } catch (error) {
        document.getElementById('result').textContent = error.message;
    }
});

const ctx = document.getElementById("myChart");

const crearGrafico = (fechas, datos) => {
    try {
        if (miGrafico !== null) {
            miGrafico.destroy(); // Destruir el gráfico existente si hay uno
        }
        miGrafico = new Chart(ctx, {
            type: "line",
            data: {
                labels: fechas,
                datasets: [
                    {
                        label: "Cambios",
                        data: datos,
                        borderWidth: 1,
                    },
                ],
            },
        });
    } catch (error) {
        console.error('Error al crear el gráfico:', error);
    }
};

const imprimirResultado = (data) => {
    let monto = document.getElementById("pesosclp").value;
    let valor = data.serie[0].valor * parseInt(monto);
    let series = data.serie.slice(0,9); // Obtener los últimos 10 días
    let fechas = series.map((item) => {
        return new Date(item.fecha).toLocaleDateString("en-GB");
    });
    let datos = series.map((item) => item.valor);
    crearGrafico(fechas, datos);
};



