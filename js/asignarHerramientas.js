const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');

ipcRenderer.on('preview', (e,data)=>{
    data = JSON.parse(data);
    $('#idEmpleado').val(data.empleado.id);
    $('#nombreEmpleado').val(data.empleado.nombres);
    ipcRenderer.send('cargarAsignaciones', data.empleado.id);
    $('#title').text(`Herramientas asignadas a ${data.empleado.nombres}`);
    
    
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
    "lengthMenu": [[5], [5]],
    'order':[[0, 'asc']],
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
            data: {_id: '_id', status: 'estadoAsignacion'},
            render: function(data){
                if(data.status !== 'activo'){
                    return "<div class='btn-group' role='group' aria-label='Basic example'><button type='button' class='btn btn-sm btn-outline-danger' onclick='devolverHerramienta("+`"`+data._id+`"`+")' title='Devolver Herramienta'><i class='fas fa-undo-alt'></i></button></div>"
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
    $('#listaAsignaciones_filter').append("<button type='button' style='float:right' class='btn btn-warning' onclick='reloadTable("+`"`+asignaciones.idEmpleado+`"`+")' title='Recargar Tabla'><i class='bi bi-arrow-repeat'></i></button>");
    setTimeout(()=>{       
        $("#spinner").addClass('visually-hidden')
        $(".container").removeClass('visually-hidden')
    },1000);    
}

$('#addPrestamo').click(()=>{
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
            cantidadAPrestar: $('#cantidadAPrestar').val(),
            idEmpleado: $('#idEmpleado').val(),
            nombreEmpleado: $('#nombreEmpleado').val()
        };
        ipcRenderer.send('crearPrestamo',obj);
    }
});

ipcRenderer.on('crearPrestamoSuccess', (e, data)=>{
    data = JSON.parse(data);
    console.log(data);
});

function reloadTable(_id){
    $("#spinner").removeClass('visually-hidden')
    $(".container").addClass('visually-hidden') 
    ipcRenderer.send('cargarAsignaciones', _id);
}