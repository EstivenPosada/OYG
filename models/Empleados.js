const { model, Schema } = require("mongoose");

const schema = new Schema({
    /* _id: { type: String, required: true }, */
    nombres               : { type: 'string', required: true },
    apellidos             : { type: 'string', required: true },
    estadoEmpleado        : { type: 'string', required: true },
    tipoDocumento         : { type: 'string', required: true },
    documento             : { type: 'string', required: true },
    genero                : { type: 'string', required: true },
    email                 : { type: 'string', required: true },
    fechaNacimiento       : { type: 'string', required: true },
    direccion             : { type: 'string', required: true },
    fechaIngreso          : { type: 'string', required: true },
    salario               : { type: 'string', required: true },
    fechaDeVencimientoCA  : { type: 'string', required: true },
    arl                   : { type: 'string', required: true },
    eps                   : { type: 'string', required: true },
    herramientas          : []
});

module.exports = model("Empleados", schema);