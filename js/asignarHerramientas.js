const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');

let maxCantidadDevolver = '';
let idAsignacion = '';
let devolviendoHerramienta = false;

ipcRenderer.on('preview', (e,data)=>{
    data = JSON.parse(data);
    $('#idEmpleado').val(data.empleado.id);
    $('#nombreEmpleado').val(data.empleado.nombres);
    $('#apellidosEmpleado').val(data.empleado.apellidos);
    ipcRenderer.send('cargarAsignaciones', data.empleado.id);
    $('#title1').text(`Formulario para asignar herramientas`);
    $('#title2').text(`Herramientas asignadas a ${data.empleado.nombres}`);  
    
    data.herramientas.forEach((element)=>{
        $('#herramienta').append($('<option>', {
            value: element.id,
            text: element.nombre
        }));
    });
});

ipcRenderer.on('renderAsignaciones', (e,data) =>{
    data = JSON.parse(data);
    renderizarAsignaciones({lista:data.asignaciones, idEmpleado:data.idEmpleado});
    setTimeout(()=>{
        $('#spinner').addClass('visually-hidden');
        $('.container').removeClass('visually-hidden');
    },1000);
});


function renderizarAsignaciones(asignaciones)
{
    rowSelection = $('#listaAsignaciones').DataTable({
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
    data : asignaciones.lista,
    columns: [
        { 
            "targets": 0, 
            data: 'nombreHerramienta',
            render: function(data){
                if(data !== undefined){
                    return data;
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
                else{
                    return '';
                }
            },
            "orderable": false
        },
        { 
            "targets": 3,
            data: null/* {_id: '_id', status: 'estadoAsignacion'} */,
            render: function(row){
                if(row.estadoAsignacion === 'activo'){
                    return "<div class='btn-group' role='group' aria-label='Basic example'><button type='button' class='btn btn-sm btn-outline-danger' onclick='devolverHerramienta("+`"`+row._id+`"`+","+`"`+row.cantidadPrestada+`"`+")' title='Devolver Herramienta'><i class='fa-solid fa-right-left'></i></button></div>"
                }
                else{
                    return '';
                }
                
            },
            "orderable": false
        },
    ],
    destroy: true,
    "responsive": true,     
    });
    $('#listaAsignaciones_filter').append("<button type='button' style='float:right' class='btn btn-warning' onclick='reloadTable("+`"`+asignaciones.idEmpleado+`"`+")' title='Recargar Tabla'><i class='fa-solid fa-arrows-repeat'></i></button>");
    setTimeout(()=>{       
        $(".container").removeClass('visually-hidden')
    },1000);    
}

function devolverHerramienta(id,cantidadPrestada){

    maxCantidadDevolver = cantidadPrestada;
    devolviendoHerramienta = true;
    idAsignacion = id;
    $('#divCantidadADevolver').removeClass('visually-hidden');
    $('#cantidadADevolver').prop('required', true);
    $('#cantidadADevolver').val('');

    $('#cantidadAPrestar').prop('required',false);
    $('#divCantidadAPrestar').addClass('visually-hidden');
    
    $('#herramienta').prop('required',false);
    $('#divNombreHerramienta').addClass('visually-hidden');

    
    /* $('#herramienta').attr('disabled',true); */
    /* console.log(herramientas); */

    /* Swal.fire(
        {
            title: '¿Quieres devolver la(s) herramienta(s) prestada(s)?',
            icon: 'question',
            confirmButtonText: 'Si',
            showDenyButton: true,
            denyButtonText: "No",
            confirmButtonColor: '#008000',
        }
    ).then((result) => {
        if (result.isConfirmed) {
            ipcRenderer.send('devolverHerramienta', id);
        } else if (result.isDenied) {
            Swal.close();
        };
    }); */
}

ipcRenderer.on('devolverHerramientaSuccess', (e,data)=>{
    Swal.fire(
        {
            title: 'Acción Exitosa!',
            text: 'Logramos hacer la devolución del préstamo',
            icon: 'success',
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            Swal.close();
            reloadTable(data);
        },3000) 
    );
});

$('#addPrestamo').click(()=>{
    if(devolviendoHerramienta){
        if($('#cantidadADevolver').val().length===0){
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'No se ha ingresado una cantidad a devolver',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(()=>{
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                },3000) 
            );
        }
        else if(parseInt($('#cantidadADevolver').val())>parseInt(maxCantidadDevolver)){
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'La cantidad de herramientas a devolver mayor que la que se prestó.',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(()=>{
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                },3000) 
            );
        }
        else{
            ipcRenderer.send('devolverHerramienta', {id:idAsignacion, cantidadADevolver:$('#cantidadADevolver').val()});
        }
    }else{
        if($('#herramienta').val()==='x'){
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'No se ha seleccionado una herramienta',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(()=>{
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                },3000) 
            );
        }else if($('#cantidadAPrestar').val()===''){
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'No se ha ingresado la cantidad que se va a prestar',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(()=>{
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                },3000) 
            );
        }else if(parseInt($('#cantidadAPrestar').val())<1){
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'La cantidad a prestar de la herramienta no puede ser menor que 1',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(()=>{
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                },3000) 
            );
        }else{
            let obj = {
                idHerramienta: $('#herramienta').val(),
                nombreHerramienta: $('#herramienta option:selected').text(),
                cantidadPrestada: $('#cantidadAPrestar').val(),
                idEmpleado: $('#idEmpleado').val(),
                nombreEmpleado: $('#nombreEmpleado').val(),
                apellidosEmpleado: $('#apellidosEmpleado').val(),
            };
            ipcRenderer.send('crearPrestamo',obj);
        }
    }
});

ipcRenderer.on('crearPrestamoSuccess', (e,data)=>{
    Swal.fire(
        {
            title: 'Acción Exitosa!',
            text: 'Logramos hacer el préstamo exitosamente',
            icon: 'success',
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            Swal.close();
            $('#herramienta').val('x').change();
            $('#cantidadAPrestar').val('');
            reloadTable(data);
        },3000) 
    );
});

ipcRenderer.on('crearPrestamoFailed', (e,data) =>{
    Swal.fire(
        {
            title: 'Acción Fallida!',
            text: `No hay suficientes herramientas disponibles. Cantidad disponible actual: ${data}`,
            icon: 'error',
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            Swal.close();
        },4500) 
    );
});

$('#cleanAsignacion').click(()=>{
    $('#herramienta').val('x').change();
    $('#cantidadAPrestar').val('');
    $('#cantidadADevolver').val('');
    $('#herramienta').attr('disabled',false);
    $('#divCantidadADevolver').addClass('visually-hidden');
    $('#cantidadADevolver').prop('required', false);
    $('#cantidadAPrestar').prop('required',true);
    $('#divCantidadAPrestar').removeClass('visually-hidden');  
    $('#herramienta').prop('required',true);
    $('#divNombreHerramienta').removeClass('visually-hidden');
    maxCantidadDevolver = '';
    devolviendoHerramienta = false;
    idAsignacion = '';
});

function reloadTable(_id){
    $("#spinner").removeClass('visually-hidden')
    $(".container").addClass('visually-hidden') 
    ipcRenderer.send('cargarAsignaciones', _id);
}