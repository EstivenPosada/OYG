const { model, Schema } = require("mongoose");

const schema = new Schema({
    /* _id: { type: String, required: true }, */
    nombreHerramienta       : { type: 'string', required: true },
    idHerramienta           : { type: 'string', required: true },
    nombreEmpleado          : { type: 'string', required: true },
    apellidosEmpleado       : { type: 'string', required: true },
    idEmpleado              : { type: 'string', required: true },
    cantidadPrestada        : { type: 'string', required: true },
    estadoAsignacion        : { type: 'string', required: true },
    //estadoADevolver         : { type: 'string', required: true },
    fechaPrestamo           : { type: 'Date' },
    fechaDevolucion         : { type: 'Date' },
});

module.exports = model("Asignaciones", schema);