setTimeout(() => {
    $("#divEmpleados").removeClass('visually-hidden');
    $("#spinner").addClass('visually-hidden');
}, 300);

empleados = [];

ipcRenderer.send('getEmpleados');

ipcRenderer.on('getEmpleados', (e, data) => {
    empleados = JSON.parse(data);
    renderEmpleados(empleados);
});


function renderEmpleados(empleados)
{
    rowSelection = $('#listaEmpleados').DataTable({
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
    'order':[[3, 'asc']],
    'info':false,
    data : empleados,
    columns: [
        { 
            "targets": 0, 
            data: 'nombres',
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
            data: 'apellidos',
            render: function(data)
            {
                if(data!==undefined){return data;}
                else{return '';}
            },
            "orderable": false
        },
        { 
            "targets": 2,
            data: 'email',
            render: function(data){
                if(data!==undefined){return data;}
                else{ return '';}
            },
            "orderable": false 
        },
        { 
            "targets": 3,
            data: 'estadoEmpleado',
            render : function(data){
                
                if(data!==undefined){
                    if(data == 'activo'){
                        return "<span class='badge bg-success'>Activo</span>"
                    }
                    else{
                        return "<span class='badge bg-danger'>Inactivo</span>"
                    }
                }
            },
            "orderable": false
        },
        { 
            "targets": 5,
            data: '_id',
            render: function(data){
                return "<div class='btn-group' role='group' aria-label='Basic example'><button type='button' class='btn btn-sm btn-outline-warning' onclick='statusEmpleado("+`"`+data+`"`+")' title='Cambiar Estado'><i class='bi bi-toggles'></i></button><button type='button' class='btn btn-sm btn-outline-success' onclick='actualizarDatosEmpleado("+`"`+data+`"`+")' title='Editar'><i class='bi bi-pencil-square'></i></button><button type='button' class='btn btn-sm btn-outline-info' onclick='verInfoEmpleado("+`"`+data+`"`+")' title='Ver Info'><i class='bi bi-eye'></i></button><button type='button' class='btn btn-sm btn-outline-primary' onclick='asignarHerramienta("+`"`+data+`"`+")' title='Asignar Herramienta'><i class='bi bi-tools'></i></button></div>"
            },
            "orderable": false
        },
    ],
    destroy: true,
    "responsive": true,     
    });
    $('#listaEmpleados_filter').append("<button type='button' style='float:right' class='btn btn-warning' onclick='reloadTable()' title='Recargar Tabla'><i class='bi bi-arrow-repeat'></i></button><button type='button' style='float:right' class='btn btn-success' onclick='nuevoEmpleado()' title='Agregar Empleado'><i class='fa-solid fa-user-plus'></i></button>");
    setTimeout(()=>{       
        $("#spinner").addClass('visually-hidden')
        $(".container").removeClass('visually-hidden')
    },1000);    
}

function reloadTable(){
    $("#spinner").removeClass('visually-hidden')
    $(".container").addClass('visually-hidden') 
    ipcRenderer.send('getEmpleados');
}

function nuevoEmpleado(){
    ipcRenderer.send('newWindow', {
        width: window.innerWidth,
        height: window.innerHeight,
        title: 'Agregar Empleado',
        ruta: '../views/formEmpleados.html',
        info: null,
    });
};

function statusEmpleado(id){
    Swal.fire(
        {
            title: '¿Quieres cambiar el estado del empleado?',
            icon: 'question',
            confirmButtonText: 'Si',
            showDenyButton: true,
            denyButtonText: "No",
            confirmButtonColor: '#008000',
        }
    ).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            ipcRenderer.send('cambiarEstadoEmpleado', {id:id});
        } else if (result.isDenied) {
            Swal.close();
        };
    });    
};

ipcRenderer.on('cambiarEstadoEmpleadoSuccess', ()=>{
    Swal.fire(
        {
            title: 'Acción Exitosa!',
            text: 'El estado del empleado se actualizó correctamente!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }
    ).then(
        setTimeout(()=>{
            ipcRenderer.send('getEmpleados');
        },2000) 
    );
});

function verInfoEmpleado(id){
    ipcRenderer.send('verInfoEmpleado', {
        width: window.innerWidth,
        height: window.innerHeight,
        title: 'Ver detalle de Empleado',
        ruta: '../views/formEmpleados.html',
        id: id,
        update:false
    });
}

function actualizarDatosEmpleado(id){
    ipcRenderer.send('verInfoEmpleado', {
        width: window.innerWidth,
        height: window.innerHeight,
        title: 'Actualizar información de Empleado',
        ruta: '../views/formEmpleados.html',
        id: id,
        update:true
    });
}