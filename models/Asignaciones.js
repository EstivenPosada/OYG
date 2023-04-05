const { model, Schema } = require("mongoose");

const schema = new Schema({
    /* _id: { type: String, required: true }, */
    nombreHerramienta     : { type: 'string', required: true },
    idHerramienta         : { type: 'string', required: true },
    nombreEmpleado        : { type: 'string', required: true },
    idEmpleado            : { type: 'string', required: true },
    cantidadPrestada      : { type: 'string', required: true },
    estadoAsignacion      : { type: 'string', required: true },
    /* genero             : { type: 'string', required: true },
    email                 : { type: 'string', required: true },
    fechaNacimiento       : { type: 'string', required: true },
    direccion             : { type: 'string', required: true },
    fechaIngreso          : { type: 'string', required: true }, */
    
});

module.exports = model("Asignaciones", schema);