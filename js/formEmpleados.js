const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2')
const form = document.querySelector("#formEmpleado");

$("#cancel").click(() => {
    ipcRenderer.send('close-sencond');
});

function fechaDeVencimientoCA() {
    let dataFecha = new Date();
    dataFecha.setFullYear(dataFecha.getFullYear() + 2);
    return dataFecha.toISOString().split("T")[0];
};
$('#fechaDeVencimientoCA').prop("max", fechaDeVencimientoCA());
$('#fechaIngreso').prop("max", new Date().toISOString().split("T")[0]);

ipcRenderer.on('create', () => {
    setTimeout(() => {
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titleSave").removeClass('visually-hidden');
        $("#botonGuardar").removeClass('visually-hidden');
    }, 500);
});


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity())
        return

    let datosEmpleado = {
        nombres: $("#nombres").val(),
        apellidos: $('#apellidos').val(),
        tipoDocumento: $('#tipoDocumento').val(),
        genero: $('#genero').val(),
        documento: $('#documento').val(),
        email: $('#email').val(),
        edad: $('#edad').val(),
        direccion: $('#direccion').val(),
        fechaIngreso: $('#fechaIngreso').val(),
        salario: $('#salario').val(),
        email: $('#email').val(),
        fechaDeVencimientoCA: $('#fechaDeVencimientoCA').val(),
        arl: $('#arl').val(),
        eps: $('#eps').val()
    }

    if ($("#id").val() !== '') {
        ipcRenderer.send('updateEmpleado', datosEmpleado);
        $("#spinner").removeClass('visually-hidden')
        $(".container").addClass('visually-hidden')
    }
    else {
        datosEmpleado.estadoEmpleado = 'activo';
        ipcRenderer.send('addEmpleado', datosEmpleado);
        $("#spinner").removeClass('visually-hidden')
        $(".container").addClass('visually-hidden')
    }
});


ipcRenderer.on('addEmpleadoSuccess', (e, data) => {
    Swal.fire(
        {
            title: 'Guardado Exitoso!',
            text: 'El empleado se registro en el sistema correctamente!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            ipcRenderer.send('close-sencond');
            ipcRenderer.send('getEmpleados');
        },2000) 
    );
});