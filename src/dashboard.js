const express = require('express');
const Chart = require('chart.js');
const app = express();
const port = 3000;

// Ruta principal
app.get('../views/index.html', (req, res) => {
    // Crear gráfico de ejemplo
    const data = {
      labels: ['Empleados'],
      datasets: [{
        label: 'Empleados',
        data: [1, 2, 3, 4, 5, 6],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
    const options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    const chart = new Chart(document.getElementById('myChart'), {
      type: 'bar',
      data: data,
      options: options
    });
  
    // Enviar respuesta con el HTML del dashboard
  }); 
  
  // Iniciar servidor
  app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
  }); 