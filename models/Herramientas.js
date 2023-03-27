const { model, Schema } = require("mongoose");


const schema = new Schema({
    //_id: { type: String, required: true },
    //[BsonElement("nombre"), BsonUnique] public string nombre { get, set },
    nombre: { type: String, required: true },
    cantidad: { type: String, required: true },
    cantidadDisponible: { type: String, required: true },
   // fechaIngreso: { type: String, required: true },
    estadoHerramienta: { type: String, required: true }
});

module.exports = model("Herramientas", schema);