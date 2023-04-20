var bb = require('billboard.js'); // Importar la biblioteca Billboard.js

var chart = bb.generate({
  data: {
    columns: [
      ['Activo', 5], // Actualiza los datos de empleados activos
      ['Inactivo', 5], // Actualiza los datos de empleados inactivos
    ],
    type: 'donut',
    onclick: function(d, i) {
      console.log('onclick', d, i);
    },
  },
  donut: {
    title: 'Empleados', // Agrega un título al gráfico
  },
  bindto: '#myChart', // Cambiar a '#myChart' para que haga referencia al id del elemento canvas
});

// Función que actualiza los datos del gráfico
function updateChart() {
  // Aquí puedes actualizar los datos de la gráfica, por ejemplo:
  chart.load({
    columns: [
      ['Activo', 10], // Actualiza los datos de empleados activos
      ['Inactivo', 2], // Actualiza los datos de empleados inactivos
    ],
  });
}
