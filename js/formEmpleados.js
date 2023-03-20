const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');
const form = document.querySelector("#formEmpleado");

$("#cancel").click(() => {
    ipcRenderer.send('close-sencond');
});

$(function(){
    //Para escribir solo letras
    $('#nombres').validCampoFranz(' abcdefghijklmnñopqrstuvwxyzáéiou');
    $('#apellidos').validCampoFranz(' abcdefghijklmnñopqrstuvwxyzáéiou');
    //Para escribir solo numeros    
   // $('#').validCampoFranz('0123456789'); 
});

function fechaDeNacimiento() {
    let dataFecha = new Date();
    dataFecha.setFullYear(dataFecha.getFullYear() - 18);
    return dataFecha.toISOString().split("T")[0];
};

$('#fechaNacimiento').prop('max', fechaDeNacimiento());

function fechaDeVencimientoCA() {
    let dataFecha = new Date();
    dataFecha.setFullYear(dataFecha.getFullYear() + 2);
    let dataFecha2 = new Date();
    return {max:dataFecha.toISOString().split("T")[0], min:dataFecha2.toISOString().split("T")[0]}
    
};
$('#fechaDeVencimientoCA').prop("max", fechaDeVencimientoCA().max);
$('#fechaDeVencimientoCA').prop("min", fechaDeVencimientoCA().min);
$('#fechaIngreso').prop("max", new Date().toISOString().split("T")[0]);

ipcRenderer.on('create', () => {
    setTimeout(() => {
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titleSave").removeClass('visually-hidden');
        $("#botonGuardar").removeClass('visually-hidden');
    }, 500);
});

ipcRenderer.on('preview', (e,data)=>{
    const infoEmpleado = data.empleado._doc;

    $("#nombres").val(infoEmpleado.nombres);
    $("#nombres").attr('disabled',true);
    $("#apellidos").val(infoEmpleado.apellidos);
    $("#apellidos").attr('disabled',true);
    $("#direccion").val(infoEmpleado.direccion);
    $("#direccion").attr('disabled',true);
    $("#tipoDocumento").val(infoEmpleado.tipoDocumento).change();
    $("#tipoDocumento").attr('disabled',true);
    $("#documento").val(infoEmpleado.documento);
    $("#documento").attr('disabled',true);
    $("#genero").val(infoEmpleado.genero).change();
    $("#genero").attr('disabled',true);
    $("#email").val(infoEmpleado.email)
    $("#email").attr('disabled',true);
    $("#fechaNacimiento").val(infoEmpleado.fechaNacimiento)
    $("#fechaNacimiento").attr('disabled',true);
    $("#fechaIngreso").val(infoEmpleado.fechaIngreso)
    $("#fechaIngreso").attr('disabled',true);
    $("#salario").val(infoEmpleado.salario)
    $("#salario").attr('disabled',true);
    $("#fechaDeVencimientoCA").val(infoEmpleado.fechaDeVencimientoCA)
    $("#fechaDeVencimientoCA").attr('disabled',true);
    $("#arl").val(infoEmpleado.arl)
    $("#arl").attr('disabled',true);
    $("#eps").val(infoEmpleado.eps)
    $("#eps").attr('disabled',true);

    setTimeout(()=>{
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titlePreview").removeClass('visually-hidden');
    });
});

ipcRenderer.on('update', (e,data)=>{
    const infoEmpleado = data.empleado._doc;
    $("#id").val(data.id);

    $("#nombres").val(infoEmpleado.nombres);
    $("#apellidos").val(infoEmpleado.apellidos);
    $("#direccion").val(infoEmpleado.direccion);
    $("#tipoDocumento").val(infoEmpleado.tipoDocumento).change();
    $("#documento").val(infoEmpleado.documento);
    $("#genero").val(infoEmpleado.genero).change();
    $("#email").val(infoEmpleado.email);
    $("#fechaNacimiento").val(infoEmpleado.fechaNacimiento);
    $("#fechaIngreso").val(infoEmpleado.fechaIngreso);
    $("#salario").val(infoEmpleado.salario);
    $("#fechaDeVencimientoCA").val(infoEmpleado.fechaDeVencimientoCA);
    $("#arl").val(infoEmpleado.arl)
    $("#eps").val(infoEmpleado.eps)

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

    let datosEmpleado = {
        nombres: $("#nombres").val(),
        apellidos: $('#apellidos').val(),
        tipoDocumento: $('#tipoDocumento').val(),
        genero: $('#genero').val(),
        documento: $('#documento').val(),
        email: $('#email').val(),
        fechaNacimiento: $('#fechaNacimiento').val(),
        direccion: $('#direccion').val(),
        fechaIngreso: $('#fechaIngreso').val(),
        salario: $('#salario').val(),
        email: $('#email').val(),
        fechaDeVencimientoCA: $('#fechaDeVencimientoCA').val(),
        arl: $('#arl').val(),
        eps: $('#eps').val()
    }

    if ($("#id").val() !== '') {
        datosEmpleado.id = $("#id").val();
        ipcRenderer.send('updateEmpleado', datosEmpleado);
        $("#spinner").removeClass('visually-hidden');
        $(".container").addClass('visually-hidden');
    }
    else {
        datosEmpleado.estadoEmpleado = 'activo';
        ipcRenderer.send('addEmpleado', datosEmpleado);
        $("#spinner").removeClass('visually-hidden');
        $(".container").addClass('visually-hidden');
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

ipcRenderer.on('addEmpleadoError',()=>{
    Swal.fire(
        {
            title: 'Guardado fallido!',
            text: 'Ya existe un empleado con este número de documento o Email!',
            icon: 'error',
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            $("#spinner").addClass('visually-hidden');
            $(".container").removeClass('visually-hidden');
            Swal.close();
        },4000) 
    );
});

ipcRenderer.on('updateEmpleadoError',()=>{
    Swal.fire(
        {
            title: 'Actualización fallida!',
            text: 'Ya existe un empleado con este número de documento o Email!',
            icon: 'error',
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            $("#spinner").addClass('visually-hidden');
            $(".container").removeClass('visually-hidden');
            Swal.close();
        },4000) 
    );
});

ipcRenderer.on('updateEmpleadoSuccess', (e,data)=>{
    Swal.fire(
        {
            title: 'Actualización Exitosa!',
            text: 'El empleado se actualizó en el sistema correctamente!',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            ipcRenderer.send('close-sencond');
            ipcRenderer.send('getEmpleados');
        },2500) 
    );
});