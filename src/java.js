// Importar las bibliotecas necesarias
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const ejs = require('ejs');

// Configurar la aplicación
const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

// Middlewares
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rutas
app.get('../index.html', (req, res) => {
  res.render('index');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`3000 ${PORT}`);
});
