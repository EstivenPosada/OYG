const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');
const moment = require('moment');

let maxCantidadDevolver = '';
let idAsignacion = '';
let devolviendoHerramienta = false;
let herramientas = [];

ipcRenderer.on('preview', (e, data) => {
    data = JSON.parse(data);
    $('#idEmpleado').val(data.empleado.id);
    $('#nombreEmpleado').val(data.empleado.nombres);
    $('#apellidosEmpleado').val(data.empleado.apellidos);
    ipcRenderer.send('cargarAsignaciones', data.empleado.id);
    $('#title1').text(`Formulario para asignar herramientas`);
    $('#title2').text(`Herramientas asignadas a ${data.empleado.nombres}`);

    data.herramientas.forEach((element) => {
        $('#herramienta').append($('<option>', {
            value: element.id,
            text: element.nombre
        }));
        herramientas.push({ nombre: element.nombre, id: element.id })
    });
});

ipcRenderer.on('renderAsignaciones', (e, data) => {
    data = JSON.parse(data);
    renderizarAsignaciones({ lista: data.asignaciones, idEmpleado: data.idEmpleado });
    setTimeout(() => {
        $('#spinner').addClass('visually-hidden');
        $('.container').removeClass('visually-hidden');
    }, 1000);
});


function renderizarAsignaciones(asignaciones) {
    rowSelection = $('#listaAsignaciones').DataTable({
        "oLanguage":
        {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se han encontrado resultados",
            "sEmptyTable": "No hay datos disponibles",
            "sInfo": "Mostrando registros de _START_ a _END_ de un total de _TOTAL_",
            "sInfoEmpty": "Mostrando registros de 0 a 0 de un total de 0",
            "sInfoFiltered": "(Filtrando un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sNext": '<span class="bi bi-chevron-right"></span>',
                "sPrevious": '<span class="bi bi-chevron-left"></span>'
            },
            "oAria": {
                "sSortAscending": ": Activate to sort the column in ascending order",
                "sSortDescending": ": Activate to sort the column in descending order"
            }
        },
        colReorder: {
            realtime: false
        },
        "processing": false,
        "serverSide": false,
        'bLengthChange': false,
        "lengthMenu": [[10], [10]],
        'order': [[2, 'asc']],
        'info': false,
        data: asignaciones.lista,
        columns: [
            {
                "targets": 0,
                data: 'nombreHerramienta',
                render: function (data) {
                    if (data !== undefined) {
                        return data;
                    } else {
                        return '';
                    }
                },
                "orderable": false
            },
            {
                "targets": 1,
                data: 'cantidadPrestada',
                render: function (data) {
                    if (data !== undefined) { return data; }
                    else { return ''; }
                },
                "orderable": false
            },
            {
                "targets": 2,
                data: 'estadoAsignacion',
                render: function (data) {
                    if (data !== undefined) {
                        if (data == 'activo') {
                            return "<span class='badge bg-success'>Activo</span>"
                        }
                        else {
                            return "<span class='badge bg-danger'>Cerrado</span>"
                        }
                    }
                    else {
                        return '';
                    }
                },
                "orderable": false
            },
            {
                "targets": 3,
                data: null/* {_id: '_id', status: 'estadoAsignacion'} */,
                render: function (row) {
                    if (row.estadoAsignacion === 'activo') {
                        return "<div class='btn-group' role='group' aria-label='Basic example'><button type='button' class='btn btn-sm btn-outline-danger' onclick='devolverHerramienta(" + `"` + row._id + `"` + "," + `"` + row.cantidadPrestada + `"` + ")' title='Devolver Herramienta'><i class='fa-solid fa-right-left'></i></button></div>"
                    }
                    else {
                        return '';
                    }

                },
                "orderable": false
            },
            {
                "targets": 4,
                "data": null,
                "render": function (row) {
                    var fechaPrestamo = row.fechaPrestamo ? moment(row.fechaPrestamo, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
                    if (row.estadoAsignacion === 'cerrado') {
                        return "<div class='btn-group' role='group' aria-label='Basic example'></div>";
                    } else {
                        return "<div>" + fechaPrestamo + "</div>";
                    }
                },
                "orderable": false
            },
            {
                "targets": 5,
                "data": null,
                "render": function (row) {
                    var fechaDevolucion = row.fechaDevolucion ? moment(row.fechaDevolucion, 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
                    if (row.estadoAsignacion === 'activo') {
                        return "<div class='btn-group' role='group' aria-label='Basic example'></div>";
                    } else {
                        return "<div>" + fechaDevolucion + "</div>";
                    }
                },
                "orderable": false
            },
           
        ],
        destroy: true,
        "responsive": true,
    });
    $('#listaAsignaciones_filter').append("<button type='button' style='float:right' class='btn btn-warning' onclick='reloadTable(" + `"` + asignaciones.idEmpleado + `"` + ")' title='Recargar Tabla'><i class='bi bi-arrow-repeat'></i></button>");
    setTimeout(() => {
        $(".container").removeClass('visually-hidden')
    }, 1000);
}

function devolverHerramienta(id, cantidadPrestada) {

    maxCantidadDevolver = cantidadPrestada;
    devolviendoHerramienta = true;
    idAsignacion = id;
    $('#divCantidadADevolver').removeClass('visually-hidden');
    $('#cantidadADevolver').prop('required', true);
    $('#cantidadADevolver').val('');

    $('#cantidadAPrestar').prop('required', false);
    $('#divCantidadAPrestar').addClass('visually-hidden');

    $('#herramienta').prop('required', false);
    $('#divNombreHerramienta').addClass('visually-hidden');
}

ipcRenderer.on('devolverHerramientaSuccess', (e, data) => {
    Swal.fire(
        {
            title: 'Acción Exitosa!',
            text: 'Logramos hacer la devolución del préstamo',
            icon: 'success',
            showConfirmButton: false
        }
    ).then(
        setTimeout(() => {
            Swal.close();
            reloadTable(data);
            $('#herramienta').val('x').change();
            $('#cantidadAPrestar').val('');
            $('#cantidadADevolver').val('');
            $('#herramienta').attr('disabled', false);
            $('#divCantidadADevolver').addClass('visually-hidden');
            $('#cantidadADevolver').prop('required', false);
            $('#cantidadAPrestar').prop('required', true);
            $('#divCantidadAPrestar').removeClass('visually-hidden');
            $('#herramienta').prop('required', true);
            $('#divNombreHerramienta').removeClass('visually-hidden');
            maxCantidadDevolver = '';
            devolviendoHerramienta = false;
            idAsignacion = '';
        }, 3000)
    );
});

ipcRenderer.on('devolverHerramientaParcialSuccess', (e, data) => {
    Swal.fire(
        {
            title: 'Acción Exitosa!',
            text: 'Logramos hacer la devolución del préstamo Parcial',
            icon: 'success',
            showConfirmButton: false
        }
    ).then(
        setTimeout(() => {
            Swal.close();
            reloadTable(data);
            $('#herramienta').val('x').change();
            $('#cantidadAPrestar').val('');
            $('#cantidadADevolver').val('');
            $('#EstadoADevolver').val('');
            $('#herramienta').attr('disabled', false);
            $('#divCantidadADevolver').addClass('visually-hidden');
            $('#cantidadADevolver').prop('required', false);
            $('#divEstadoADevolver').addClass('visually-hidden');
            $('#EstadoADevolver').prop('required', false);
            $('#cantidadAPrestar').prop('required', true);
            $('#divCantidadAPrestar').removeClass('visually-hidden');
            $('#herramienta').prop('required', true);
            $('#divNombreHerramienta').removeClass('visually-hidden');
            maxCantidadDevolver = '';
            devolviendoHerramienta = false;
            idAsignacion = '';
        }, 3000)
    );
});

$('#addPrestamo').click(() => {
    if (devolviendoHerramienta) {
        if ($('#cantidadADevolver').val().length === 0) {
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'No se ha ingresado una cantidad a devolver',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(() => {
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                }, 3000)
            );
        }
        else if (parseInt($('#cantidadADevolver').val()) > parseInt(maxCantidadDevolver)) {
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'La cantidad de herramientas a devolver es mayor que la que se prestó.',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(() => {
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                }, 3000)
            );
        }
        else if ($('#cantidadADevolver').val() === '00' || $('#cantidadADevolver').val() === '000' || $('#cantidadADevolver').val() === '0') {
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'La cantidad de herramientas a devolver debe ser mayor que cero (0)',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(() => {
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                }, 3000)
            );
        }
        else {
            ipcRenderer.send('devolverHerramienta', { id: idAsignacion, cantidadADevolver: $('#cantidadADevolver').val() });
        }
    }
    var asign = [];
    var asignaciones = document.getElementsByClassName('asignacion');
    for (var i = 0; i < asignaciones.length; i++) {
        var obj = {
            idHerramienta: asignaciones[i].getElementsByClassName('herr')[0].options[asignaciones[i].getElementsByClassName('herr')[0].selectedIndex].value,
            cantidadPrestada: asignaciones[i].getElementsByClassName('canti')[0].value,
            nombreHerramienta: asignaciones[i].getElementsByClassName('herr')[0].options[asignaciones[i].getElementsByClassName('herr')[0].selectedIndex].text,
            idEmpleado: $('#idEmpleado').val(),
            nombreEmpleado: $('#nombreEmpleado').val(),
            apellidosEmpleado: $('#apellidosEmpleado').val(),
        };
        asign.push(obj);
    }
    let valido = true;
    asign.forEach(a => {
        if (a.idHerramienta === '') {
            valido = false;
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'No se ha seleccionado una herramienta en el primer campo',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(() => {
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                }, 3000)
            ); 
        } else if (a.cantidadPrestada === 'x') {
            valido = false;
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'No se ha ingresado la cantidad que se va a prestar',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(() => {
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                }, 3000)
            );
        } else if (parseInt(a.cantidadPrestada) < 1) {
            valido = false;
            Swal.fire(
                {
                    title: 'Acción Fallida!',
                    text: 'La cantidad a prestar de la herramienta no puede ser menor que 1',
                    icon: 'error',
                    showConfirmButton: false
                }
            ).then(
                setTimeout(() => {
                    $("#spinner").addClass('visually-hidden');
                    $(".container").removeClass('visually-hidden');
                    Swal.close();
                }, 3000)
            );
        }
    })
    if (valido) {
        console.log(asign);
        ipcRenderer.send('crearPrestamo', asign);
    }

});

ipcRenderer.on('crearPrestamoSuccess', (e, data) => {
    const fechaPrestamo = new Date(); // Get the current date
    const fechaDevolucion = new Date(fechaPrestamo.getFullYear(), fechaPrestamo.getMonth() + 1, fechaPrestamo.getDate()); // Add one month to the current date
  
    Swal.fire({
      title: 'Acción Exitosa!',
      text: 'Logramos hacer el préstamo exitosamente',
      icon: 'success',
      showConfirmButton: false
    }).then(() => {
      $('#herramienta').val('x').change();
      $('#cantidadAPrestar').val('');
      var elements = document.querySelectorAll(".asignacion.adicional");
      elements.forEach(function (element) {
        element.remove();
      });
  
      reloadTable(data);
  
      // Muestra el mensaje de la fecha de devolución
      Swal.fire({
        title: 'Fechas',
        html: `La fecha de préstamo es: ${fechaPrestamo.toLocaleDateString()}<br>
               La fecha limite de devolución es: ${fechaDevolucion.toLocaleDateString()}`,
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    });
  });
  
  

ipcRenderer.on('crearPrestamoFailed', (e, data) => {
    Swal.fire(
        {
            title: 'Acción Fallida!',
            text: `No hay suficientes herramientas disponibles. Cantidad disponible actual: ${data}`,
            icon: 'error',
            showConfirmButton: false
        }
    ).then(
        setTimeout(() => {
            Swal.close();
        }, 4500)
    );
});

$('#cleanAsignacion').click(() => {
    $('#herramienta').val('x').change();
    $('#cantidadAPrestar').val('');
    $('#cantidadADevolver').val('');
    $('#herramienta').attr('disabled', false);
    $('#divCantidadADevolver').addClass('visually-hidden');
    $('#cantidadADevolver').prop('required', false);
    $('#cantidadAPrestar').prop('required', true);
    $('#divCantidadAPrestar').removeClass('visually-hidden');
    $('#herramienta').prop('required', true);
    $('#divNombreHerramienta').removeClass('visually-hidden');
    maxCantidadDevolver = '';
    devolviendoHerramienta = false;
    idAsignacion = '';
});

function reloadTable(_id) {
    $("#spinner").removeClass('visually-hidden')
    $(".container").addClass('visually-hidden')
    ipcRenderer.send('cargarAsignaciones', _id);
}

ipcRenderer.on('cargarAsignaciones', (e, data) => {

    $("#spinner").addClass('visually-hidden')
    $(".container").removeClass('visually-hidden')
    let table = $('#tableAsignaciones').DataTable();
    table.clear();
    table.rows.add(data);
    table.draw();
});

function agregarCampo() {
    var camposAsignacion = document.getElementById('camposAsignacion');
    var nuevoCampo = document.createElement('div');

    nuevoCampo.className = 'asignacion adicional';
    nuevoCampo.innerHTML = `

    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div class="col-lg-6 col-sm-12">
						<div class="mb-6">
							<label class="form-label is-required" for="herramienta">Herramienta</label>
							<!-- id="herramienta" --><select name="herramienta[]" class="form-select herr" required>
							</select>
							<div class="invalid-feedback">Debe seleccionar una opción</div>
						</div>
					</div>
					<div class="col-lg-4 col-sm-12">
								<div class="mb-6">
							<label class="form-label is-required" for="cantidadAPrestar">Cantidad a prestar</label>
							<!-- id="cantidadAPrestar" --><input type="text" name="cantidadAPrestar[]"  class="form-control numbers canti"
								placeholder="Ingresa la cantidad" minlength="1" maxlength="3" required>
							<div class="invalid-feedback">Debe completar este campo</div>
						</div>
                        </div>
                        <button type="button" onclick="remover(this)" class="btn btn-light" style="height: 30px; width: 30px;"> 
                        X
                        </button>
					</div>
                    
                    `;
    camposAsignacion.appendChild(nuevoCampo);

    // Capturar todos los elementos select con el atributo "name" igual a "miSelect"
    var selects = document.querySelectorAll('select[name="herramienta[]"]');

    // Recorrer los elementos select y verificar si contienen opciones
    selects.forEach(function (select) {
        // Verificar si el select tiene opciones
        if (select.getElementsByTagName('option').length < 1) {
            // Agregar valores al select
            herramientas.forEach(herramienta => {
                var option = document.createElement('option');
                option.value = herramienta.id;
                option.textContent = herramienta.nombre;
                select.appendChild(option);
            })

        }
    });

}

// Función para eliminar una copia de los campos de asignación
function remover(button) {
    var assignment = button.parentNode;
    var assignmentContainer = assignment.parentNode;
    assignmentContainer.removeChild(assignment);
}

ipcRenderer.on('preview', (e, data) => {
    data = JSON.parse(data);
    // Resto del código...

    // Verificar el estado de inactividad del empleado
    if (data.empleado.activo === false) {
        Swal.fire(
            'Empleado Inactivo',
            'El empleado está inactivo. No se puede realizar ninguna acción.',
            'error'
        );
    }
});

