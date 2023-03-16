const { model, Schema } = require("mongoose");

const schema = new Schema({
    /* _id: { type: String, required: true }, */
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    tipoDocumento: { type: String, required: true },
    documento: { type: String, required: true },
    genero: { type: String, required: true },
    email: { type: String, required: true },
    fechaNacimiento: { type: String, required: true },
    direccion: { type: String, required: true },
    fechaIngreso: { type: String, required: true },
    salario: { type: String, required: true },
    fechaDeVencimientoCA: { type: String, required: true },
    arl: { type: String, required: true },
    eps: { type: String, required: true },
    estadoEmpleado: { type: String, required: true }
});

module.exports = model("Empleados", schema);