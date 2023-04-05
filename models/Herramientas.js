const { model, Schema } = require("mongoose");


const schema = new Schema({
    /* _id: { type: String, required: true }, */
    //[BsonElement("nombre"), BsonUnique] public string nombre { get, set },
    nombre: { type: String, required: true },
    cantidad: { type: String, required: true },
    cantidadDisponible: { type: String, required: true },
    // fechaIngreso: { type: String, required: true },
    estadoHerramienta: { type: String, required: true }
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    });

schema.virtual('id').get(function () {
    return this._id.toHexString();
});

module.exports = model("Herramientas", schema);