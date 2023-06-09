ipcRenderer.send('getEmpleadosActivos');

ipcRenderer.on('getEmpleadosActivosResponse', (e, data) => {
    var chart = bb.generate({
        data: {
            columns: [
                ['Activo', data.activos], // Actualiza los datos de empleados activos
                ['Inactivo', data.inactivos], // Actualiza los datos de empleados inactivos
            ],
            type: 'bar',
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

ipcRenderer.send('getHerramientasActivos');

ipcRenderer.on('getHerramientasActivosResponse', (e, data) => {
    var chart = bb.generate({
        data: {
            columns: [
                ['Activo', data.activos], // Actualiza los datos de Herramientas activos
                ['Inactivo', data.inactivos], // Actualiza los datos de Herramientas inactivos
            ],
            type: 'polar',
            onclick: function (d, i) {
                console.log('onclick', d, i);
            },
        },
        donut: {
            title: 'Herramientas', // Agrega un título al gráfico
        },
        bindto: '#bar',
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

// En el proceso principal (main process)
ipcMain.on('getHerramientasActivos', async (e) => {
    let herramientas = await Herramientas.find();
    let cantidad = 0;
    let cantidadDisponible = 0;
    herramientas.forEach((element) => {
      cantidad += element.cantidad;
      cantidadDisponible += element.disponible;
    });
    mainWindow.webContents.send('getHerramientasActivosResponse', { cantidad, cantidadDisponible });
  });
  
  // En el proceso de renderizado (renderer process)
  ipcRenderer.send('getHerramientasPrestadas');
  
  ipcRenderer.on('getHerramientasPrestadasResponse', (e, data) => {
    var chart = bb.generate({
      data: {
        columns: [
          ['Cantidad', data.cantidad], // Actualiza los datos de la cantidad total de herramientas
          ['Cantidad Disponible', data.cantidadDisponible], // Actualiza los datos de la cantidad disponible de herramientas
        ],
        type: 'polar',
        onclick: function (d, i) {
          console.log('onclick', d, i);
        },
      },
      donut: {
        title: 'Herramientas', // Agrega un título al gráfico
      },
      bindto: '#bar',
    });
  
    // Función que actualiza los datos del gráfico
    function updateChart() {
      chart.load({
        columns: [
          ['Cantidad', data.cantid], // Actualiza los datos de la cantidad de herramientas
          ['Cantidad Disponible', data.cantidadDisponible], // Actualiza los datos de la cantidad disponible de herramientas
        ],
      });
    }
  });
  
  