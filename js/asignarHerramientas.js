const { ipcRenderer } = require("electron");

ipcRenderer.on('preview', (e,data)=>{
    data = JSON.parse(data);
    $('#title').text(`Herramientas asignadas a ${data.empleado.nombres}`);
    
    data.herramientas.forEach((element)=>{
        $('#herramienta').append($('<option>', {
            value: element._id,
            text: element.nombre
        }));
    });
    renderizarAsignaciones({lista:data.asignaciones, idEmpleado:data.empleado.id});
    console.log(data);
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

function reloadTable(_id){
    $("#spinner").removeClass('visually-hidden')
    $(".container").addClass('visually-hidden') 
    ipcRenderer.send('recargarAsignadas', _id);
}