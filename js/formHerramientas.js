const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');
const form = document.querySelector("#formHerramienta");

$("#cancel").click(() => {
    ipcRenderer.send('close-sencond');
});

/* function fechaDeVencimientoCA() {
    let dataFecha = new Date();
    dataFecha.setFullYear(dataFecha.getFullYear() + 2);
    return dataFecha.toISOString().split("T")[0];
};
$('#fechaDeVencimientoCA').prop("max", fechaDeVencimientoCA());
$('#fechaIngreso').prop("max", new Date().toISOString().split("T")[0]); */

ipcRenderer.on('create', () => {
    setTimeout(() => {
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titleSave").removeClass('visually-hidden');
        $("#botonGuardar").removeClass('visually-hidden');
    }, 500);
});

ipcRenderer.on('preview', (e,data)=>{
    const infoHerramienta = data.herramienta._doc;

    $("#nombre").val(infoHerramienta.nombre);
    $("#nombre").attr('disabled',true);
    $("#cantidad").val(infoHerramienta.cantidad);
    $("#cantidad").attr('disabled',true);
    $("#cantidadDisponible").val(infoHerramienta.cantidadDisponible);
    $("#cantidadDisponible").attr('disabled',true);
    $("#fechaIngreso").val(infoHerramienta.fechaIngreso)
    $("#fechaIngreso").attr('disabled',true);

    setTimeout(()=>{
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titlePreview").removeClass('visually-hidden');
    });
});

ipcRenderer.on('update', (e,data)=>{
    const infoHerramienta = data.herramienta._doc;
    $("#id").val(data.id);

    $("#nombre").val(infoHerramienta.nombre);
    $("#cantidad").val(infoHerramienta.cantidad);
    $("#cantidadDisponible").val(infoHerramienta.cantidadDisponible);
    $("#fechaIngreso").val(infoHerramienta.fechaIngreso);

    setTimeout(()=>{
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titleUpdate").removeClass('visually-hidden');
        $("#botonGuardar").removeClass('visually-hidden');
    });

});


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity())
        return

    let datosHerramienta = {
        nombre: $("#nombre").val(),
        cantidad: $('#cantidad').val(),
        cantidadDisponible: $('#cantidadDisponible').val(),
        fechaIngreso: $('#fechaIngreso').val(),
    }

    if ($("#id").val() !== '') {
        datosHerramienta.id = $("#id").val();
        ipcRenderer.send('updateHerramienta', datosHerramienta);
        $("#spinner").removeClass('visually-hidden');
        $(".container").addClass('visually-hidden');
    }
    else {
        datosHerramienta.estadoHerramienta = 'activo';
        ipcRenderer.send('addHerramienta', datosHerramienta);
        $("#spinner").removeClass('visually-hidden');
        $(".container").addClass('visually-hidden');
        
    }
});


ipcRenderer.on('addHerramientaSuccess', (e, data) => {
    Swal.fire(
        {
            title: 'Guardado Exitoso!',
            text: 'la Herramienta se registro en el sistema correctamente!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            ipcRenderer.send('close-sencond');
            ipcRenderer.send('getHerramientas');
        },2000) 
    );
});

ipcRenderer.on('updateHerramientaSuccess', (e,data)=>{
    Swal.fire(
        {
            title: 'Actualización Exitosa!',
            text: 'La Herramienta se actualizó en el sistema correctamente!',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            ipcRenderer.send('close-sencond');
            ipcRenderer.send('getHerramientas');
        },2500) 
    );
});