const { app, BrowserWindow } = require('electron');
const path = require('path');
const { MongoClient } = require('mongodb');

let mainWindow;
let db;

async function connectToDatabase() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    db = client.db('dashboard-empleados');
  } catch (err) {
    console.log(err);
  }
}

async function getEmpleados() {
  try {
    const collection = db.collection('empleados');
    const empleados = await collection.find({}).toArray();
    return empleados;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function crearEmpleado(empleado) {
  try {
    const collection = db.collection('empleados');
    await collection.insertOne(empleado);
  } catch (err) {
    console.log(err);
  }
}

function crearListaEmpleados(empleados) {
  const lista = document.createElement('ul');

  empleados.forEach((empleado) => {
    const item = document.createElement('li');
    item.innerText = `${empleado.nombre} (${empleado.activo ? 'Activo' : 'Inactivo'})`;
    lista.appendChild(item);
  });

  return lista;
}

async function createWindow() {
  await connectToDatabase();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  const empleados = await getEmpleados();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    const appDiv = document.getElementById('app');
    appDiv.appendChild(crearListaEmpleados(empleados));
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Código de la aplicación
