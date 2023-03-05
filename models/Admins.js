const { model, Schema } = require("mongoose");

const schema = new Schema({
    _id: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = model("Admins", schema);