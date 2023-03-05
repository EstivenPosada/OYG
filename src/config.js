require("dotenv").config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://johanposada:blBWrwwR5tqdlOQP@cluster0.pqu23ep.mongodb.net/?retryWrites=true&w=majority",
};