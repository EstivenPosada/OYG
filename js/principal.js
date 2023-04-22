ipcRenderer.send('getEmpleadosActivos');

ipcRenderer.on('getEmpleadosActivosResponse', (e, data) => {
    var chart = bb.generate({
        data: {
            columns: [
                ['Activo', data.activos], // Actualiza los datos de empleados activos
                ['Inactivo', data.inactivos], // Actualiza los datos de empleados inactivos
            ],
            type: 'donut',
            onclick: function (d, i) {
                console.log('onclick', d, i);
            },
        },
        donut: {
            title: 'Empleados', // Agrega un título al gráfico
        },
        bindto: '#donut-chart',
    });

    // Función que actualiza los datos del gráfico
    function updateChart() {
        // Aquí puedes actualizar los datos de la gráfica, por ejemplo:
        chart.load({
            columns: [
                ['Activo', data.activos], // Actualiza los datos de empleados activos
                ['Inactivo', data.inactivos], // Actualiza los datos de empleados inactivos
            ],
        });
    }
});
