const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');
const form = document.querySelector("#formHerramienta");
const { app } = require('electron');

let cantidad = 0;
let cantidadDisponible = 0;


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
$("#cantidadDisponible").attr('disabled',true);


function cambiarDisponible(input){
    
    if($('#id').val()==''){
        document.getElementById("cantidadDisponible").value = input.value; 
    }else{
        document.getElementById("cantidadDisponible").value = cantidadDisponible + Math.floor(input.value) - cantidad; 
    }
};

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

    const prestamos = JSON.parse(data.prestamos);
    renderPrestamos(prestamos);

    setTimeout(()=>{
        $("#spinner").addClass('visually-hidden');
        $(".container").removeClass('visually-hidden');
        $("#titlePreview").removeClass('visually-hidden');
    });
});

ipcRenderer.on('update', (e,data)=>{
    const infoHerramienta = data.herramienta._doc;
    cantidad = Math.floor(infoHerramienta.cantidad);
    cantidadDisponible = Math.floor(infoHerramienta.cantidadDisponible);
    $("#id").val(data.id);

    $("#nombre").val(infoHerramienta.nombre);
    $("#cantidad").val(infoHerramienta.cantidad);
    $("#cantidadDisponible").val(infoHerramienta.cantidadDisponible);


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
    }

    if ($("#id").val() !== '') {        
        if(datosHerramienta.cantidadDisponible<0){
            Swal.fire(
                {
                    title: 'Acción incorrecta',
                    text: 'La cantidad disponible no puede ser menor que cero (0)',
                    icon: 'error'
                }
            );
        }else{
            datosHerramienta.cantidadDisponible=(datosHerramienta.cantidadDisponible).toString();
            datosHerramienta.id = $("#id").val();
            ipcRenderer.send('updateHerramienta', datosHerramienta);
            $("#spinner").removeClass('visually-hidden');
            $(".container").addClass('visually-hidden');
        }
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

ipcRenderer.on('errorMessage', (e, data)=>{
    Swal.fire(
        {
            title: 'Oops!',
            text: data,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            $("#spinner").addClass('visually-hidden');
            $(".container").removeClass('visually-hidden');
        },3000) 
    );
});

/* ------------------------------------------------------- AQUÍ VA LA LISTA DE LOS PRÉSTAMOS DE ESA HERRAMIENTA---------------------------------------- */
function renderPrestamos(prestamos)
{
    $('#listaDeLosPrestamos').removeClass('visually-hidden');
    rowSelection = $('#listaPrestamos').DataTable({
    "oLanguage":
    {
        "sProcessing":     "Procesando...",
        "sLengthMenu":     "Mostrar _MENU_ registros",
        "sZeroRecords":    "No se han encontrado resultados",
        "sEmptyTable":     "No hay datos disponibles",
        "sInfo":           "Mostrando registros de _START_ a _END_ de un total de _TOTAL_",
        "sInfoEmpty":      "Mostrando registros de 0 a 0 de un total de 0",
        "sInfoFiltered":   "(Filtrando un total de _MAX_ registros)",
        "sInfoPostFix":    "",
        "sSearch":         "Buscar:",
        "sUrl":            "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sNext":  '<span class="bi bi-chevron-right"></span>',
            "sPrevious": '<span class="bi bi-chevron-left"></span>'
        },
        "oAria": {
            "sSortAscending":  ": Activate to sort the column in ascending order",
            "sSortDescending": ": Activate to sort the column in descending order"
        }
    },      
    colReorder: {
        realtime: false
    },
    "processing": false,
    "serverSide": false,
    'bLengthChange':false,
    "lengthMenu": [[10], [10]],
    'order':[[2, 'asc']],
    'info':false,
    data : prestamos,
    columns: [
        { 
            "targets": 0, 
            data: null,
            render: function(row){
                if(row !== undefined){
                    return row.nombreEmpleado + ' ' + row.apellidosEmpleado;
                }else{
                    return '';
                }
            },
            "orderable": false 
        },
        { 
            "targets": 1,
            data: 'cantidadPrestada',
            render: function(data)
            {
                if(data!==undefined){return data;}
                else{return '';}
            },
            "orderable": false
        },
        { 
            "targets": 2,
            data: 'estadoAsignacion',
            render: function(data)
            {
                if(data!==undefined){
                    if(data == 'activo'){
                        return "<span class='badge bg-success'>Activo</span>"
                    }
                    else{
                        return "<span class='badge bg-danger'>Cerrado</span>"
                    }
                }
            },
            "orderable": false
        }
    ],
    destroy: true,
    "responsive": true,     
    });
    $('#listaPrestamos_filter').append("<button type='button' style='float:right' class='btn btn-warning' onclick='reloadTable()' title='Recargar Tabla'><i class='bi bi-arrow-repeat'></i></button>");
    setTimeout(()=>{
        $(".containerLista").removeClass('visually-hidden')
    },1000);    
}