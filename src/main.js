const { BrowserWindow, shell } = require("electron");
const { ipcMain } = require("electron");
const settings = require('electron-settings');
const path = require('path');
const url = require('url');
const fs = require('fs');
const moment = require('moment');
const Admins = require('../models/Admins');
const Empleados = require('../models/Empleados');
const Herramientas = require('../models/Herramientas');
const Asignaciones = require('../models/Asignaciones');

var BreakException = {};
let widthA = [640, 854, 800, 1024, 1152, 1280, 1360, 1366, 1440, 1600, 1680, 1920];
let heightA = [480, 576, 600, 720, 768, 800, 864, 900];

let mainWindow; //
let secondWindow; //para ver vistas de detalle
let loginWindow; //primera ventana que va a ver el cliente

ipcMain.on('check-google', async (e) => {
    if (settings.hasSync('userAccount')) {
        loginWindow.webContents.send('LoginSuccess');
    }
});

ipcMain.on('logoutGoogle', async (e) => {
    settings.unsetSync(); //Borra la data del usuario en settings
    crearVentanaLogin();
    mainWindow.destroy();
    loginWindow.focus();
    loginWindow.show();
});

function crearVentanaLogin() {
    loginWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        autoHideMenuBar: false,
        frame: false,
        center: true,
        roundedCorners: true
    });
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../views/login.html"),
        protocol: 'file',
        slashes: true
    }));
};

ipcMain.on("cerrarVentana", () => {
    loginWindow.destroy();
});

ipcMain.on("Google", async (e) => {
    shell.openExternal("http://localhost:3000")
});

ipcMain.on("GoogleAuthSucces", async (e, user) => {
    loginWindow.focus();
    loginWindow.show();
    let findAdmin = await Admins.find({ email: user.email });
    if (findAdmin.length > 0) {
        userAccount = {
            name: user.name,
            sub: user.sub,
            given_name: user.given_name,
            family_name: user.family_name,
            email_verified: user.email_verified,
            verified: user.verified,
            language: user.language,
            email: user.email,
            picture: user.picture,
            hd: user.hd,
            domain: user.domain,
            accessToken: user.accessToken
        };
        await settings.set({ userAccount: userAccount })//GUARDADO DE SESION DEL USUARIO EN SETTINGS LOCALES
        loginWindow.webContents.send('LoginSuccess')
    }
    else {
        settings.unsetSync();
        loginWindow.webContents.send('GoogleAuthFail')
    }
});

ipcMain.on('validate-google', async (e, args) => {
    if (settings.hasSync('userAccount')) {
        userAccount = await settings.get('userAccount');
        createWindow(args, userAccount);
        loginWindow.destroy();
    }
});

function createWindow(args, userAccount) {
    mainWindow = new BrowserWindow({
        width: calcSize(args.width, widthA),
        height: calcSize(args.height, heightA),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        autoHideMenuBar: true,
        center: true,
        roundedCorners: true
    });
    mainWindow.setTitle('OYG');
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../views/index.html"),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.on('ready-to-show', (e) => {
        mainWindow.webContents.send('data-user', userAccount);
    });
}

function calcSize(value, array) {
    let result = array[0]
    array.forEach(element => {
        if (element < value)
            result = element
    });
    return result
}

ipcMain.on('change-window', async (e, args) => {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, args.ruta),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.setTitle(args.title);
    let userAccount = await settings.get('userAccount')
    mainWindow.on('ready-to-show', (e) => {
        mainWindow.webContents.send('data-user', userAccount)
    });
});

//Empleados

ipcMain.on('getEmpleados', async (e) => {
    const listaEmpleados = await Empleados.find().sort({ name: 1 });
    mainWindow.webContents.send('getEmpleados', JSON.stringify(listaEmpleados));
});

function newWindow(data) {
    secondWindow = new BrowserWindow({
        width: calcSize(data.width, widthA),
        height: calcSize(data.height, heightA),
        modal: true,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        autoHideMenuBar: true,
        center: true,
        roundedCorners: true
    });
    secondWindow.setTitle(data.title);
    secondWindow.loadURL(url.format({
        pathname: path.join(__dirname, data.ruta),
        protocol: 'file',
        slashes: true
    }));
    if (data.info != null) {
        secondWindow.on("ready-to-show", () => {
            if (data.update) {
                secondWindow.webContents.send('update', data.info);
            } else {
                secondWindow.webContents.send('preview', data.info);
            }
        });
    } else {
        secondWindow.on("ready-to-show", () => {
            secondWindow.webContents.send('create');
        });
    }
    secondWindow.on('closed', () => {
        secondWindow = null;
        mainWindow.focus();
        mainWindow.show();
    });
};

ipcMain.on('newWindow', (e, args) => {
    newWindow(args);
});

ipcMain.on('close-sencond', () => {
    secondWindow.destroy();
    mainWindow.focus();
    mainWindow.show();
});

ipcMain.on('addEmpleado', async (e, data) => {
    const newEmpleado = new Empleados(data);
    const saved = await newEmpleado.save();
    secondWindow.webContents.send("addEmpleadoSuccess", JSON.stringify(saved));
    const listaEmpleados = await Empleados.find().sort({ name: 1 });
    let guardar = true;
    try {
        listaEmpleados.forEach(empleado => {
            if (data.documento === empleado.documento || data.email === empleado.email) {
                secondWindow.webContents.send("addEmpleadoError");
                guardar = false;
                throw BreakException;
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    if (guardar) {
        const newEmpleado = new Empleados(data);
        const saved = await newEmpleado.save();
        secondWindow.webContents.send("addEmpleadoSuccess", JSON.stringify(saved));
    }
});



ipcMain.on('cambiarEstadoEmpleado', async (e, data) => {
    const empleado = await Empleados.findById(data.id);
    let status = 'activo';
    if (empleado.estadoEmpleado === 'activo') {
        status = 'inactivo';
    }
    const updated = await Empleados.findByIdAndUpdate(
        empleado._id,
        { estadoEmpleado: status },
        { new: true }
    );
    mainWindow.webContents.send('cambiarEstadoEmpleadoSuccess');
});

ipcMain.on('verInfoEmpleado', async (e, data) => {
    const empleado = await Empleados.findById(data.id);
    let object = {
        width: data.width,
        height: data.height,
        title: data.title,
        ruta: data.ruta,
        update: data.update,
        info: { empleado: empleado, id: data.id }
    }
    newWindow(object);
});

ipcMain.on('getEmpleadosActivos', async(e)=>{
    let empleados = await Empleados.find();
    let activos = 0;
    let inactivos = 0;
    empleados.forEach(element =>{
        if(element.estadoEmpleado==='activo'){
            activos += 1;
        }else{
            inactivos +=1;
        }
    });
    mainWindow.webContents.send('getEmpleadosActivosResponse',{activos:activos,inactivos:inactivos});
});


//Dashboar de Empleados.
ipcMain.on('updateEmpleado', async (e, data) => {
    /*  const updated = await Empleados.findByIdAndUpdate(data.id,data,{new:true});
     secondWindow.webContents.send('updateEmpleadoSuccess'); */
    const listaEmpleados = await Empleados.find().sort({ name: 1 });
    let update = true;
    try {
        listaEmpleados.forEach(empleado => {
            if (empleado._id.valueOf() !== data.id) {
                if (data.documento === empleado.documento || data.email === empleado.email) {
                    secondWindow.webContents.send("updateEmpleadoError");
                    update = false;
                    throw BreakException;
                }
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    if (update) {
        const updated = await Empleados.findByIdAndUpdate(data.id, data, { new: true });
        secondWindow.webContents.send('updateEmpleadoSuccess');
    }
});

//Dashboar de Herramientas.
ipcMain.on('getHerramientasActivos', async(e)=>{
    let herramientas = await Herramientas.find();
    let activos = 0;
    let inactivos = 0;
    herramientas.forEach(element =>{
        if(element.estadoHerramienta==='activo'){
            activos += 1;
        }else{
            inactivos +=1;
        }
    });
    mainWindow.webContents.send('getHerramientasActivosResponse',{activos:activos,inactivos:inactivos});
});

ipcMain.on('updateHerramienta', async (e, data) => {
    /*  const updated = await Herramientas.findByIdAndUpdate(data.id,data,{new:true});
     secondWindow.webContents.send('updateHerramientaSuccess'); */
    const listaHerramienta = await Herramientas.find().sort({ name: 1 });
    let update = true;
    try {
        listaHerramienta.forEach(herramienta => {
            if (herramienta._id.valueOf() !== data.id) {
                if (data.documento === herramienta.documento) {
                    secondWindow.webContents.send("updateHerramientaError");
                    update = false;
                    throw BreakException;
                }
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }
    if (update) {
        const updated = await Herramientas.findByIdAndUpdate(data.id, data, { new: true });
        secondWindow.webContents.send('updateHerramientaSuccess');
    }
});

//Herramientas

ipcMain.on('getHerramientas', async (e) => {
    const listaHerramientas = await Herramientas.find().sort({ name: 1 });
    mainWindow.webContents.send('getHerramientas', JSON.stringify(listaHerramientas));
});

ipcMain.on('addHerramienta', async (e, data) => {
    const mismaHerramienta = await Herramientas.findOne({nombre:data.nombre});
    if(mismaHerramienta !== null){
        secondWindow.webContents.send('errorMessage', 'Ya existe una herramienta con este nombre.');
    }
    else{
        const newHerramienta = new Herramientas(data);
        const saved = await newHerramienta.save();
        secondWindow.webContents.send("addHerramientaSuccess", JSON.stringify(saved));
    }
});

ipcMain.on('cambiarEstadoHerramienta', async (e, data) => {
    const herramienta = await Herramientas.findById(data.id);
    let status = 'activo';
    if (herramienta.estadoHerramienta === 'activo') {
        status = 'inactivo';
    }
    const updated = await Herramientas.findByIdAndUpdate(
        herramienta._id,
        { estadoHerramienta: status },
        { new: true }
    );
    mainWindow.webContents.send('cambiarEstadoHerramientaSuccess');
});

ipcMain.on('verInfoHerramienta', async (e, data) => {
    const herramienta = await Herramientas.findById(data.id);
    const prestamosExistentes = await Asignaciones.find({idHerramienta:data.id});
    let object = {
        width: data.width,
        height: data.height,
        title: data.title,
        ruta: data.ruta,
        update: data.update,
        info: { herramienta: herramienta, id: data.id , prestamos: JSON.stringify(prestamosExistentes)}
    }
    newWindow(object);
});

ipcMain.on('updateHerramienta', async (e, data) => {
    const updated = await Herramientas.findByIdAndUpdate(data.id, data, { new: true });
    secondWindow.webContents.send('updateHerramientaSuccess');
});

ipcMain.on('verHerramientasAsignadas', async (e, data) => {
    const herramientasActivas = await Herramientas.find({ estadoHerramienta: 'activo' });

    let object = {
        width: data.width,
        height: data.height,
        title: data.title,
        ruta: data.ruta,
        update: data.update,
        info: JSON.stringify({
            empleado: {
                nombres: data.nombres,
                apellidos:data.apellidos,
                id: data.id
            },
            herramientas: herramientasActivas
        })
    }
    newWindow(object);
});

ipcMain.on('cargarAsignaciones', async (e, data) => {
    const asignacionesEncontradas = await Asignaciones.find({ idEmpleado: data });
    secondWindow.webContents.send('renderAsignaciones', JSON.stringify({ asignaciones: asignacionesEncontradas, idEmpleado: data }));
});

ipcMain.on('crearPrestamo', async (e, data) => {
    const herramienta = await Herramientas.findById(data.idHerramienta);
    if ((parseInt(herramienta.cantidadDisponible)-parseInt(data.cantidadPrestada))<0) {
      secondWindow.webContents.send('crearPrestamoFailed', herramienta.cantidadDisponible);
    } else {
      let activos = false;
      let asignacionesExistentes = await Asignaciones.find({ idEmpleado: data.idEmpleado, idHerramienta: data.idHerramienta });
      asignacionesExistentes = JSON.parse(JSON.stringify(asignacionesExistentes));
      if (asignacionesExistentes.length === 0) {
        data.estadoAsignacion = 'activo';
        const newAsignacion = new Asignaciones(data);
        newAsignacion.fechaPrestamo = moment().format('YYYY-MM-DD'); // Agregar fecha de préstamo actual
        const saved = await newAsignacion.save();
        const herramientaUpdate = await Herramientas.findByIdAndUpdate(
          data.idHerramienta,
          {
            cantidadDisponible: (parseInt(herramienta.cantidadDisponible) - parseInt(data.cantidadPrestada)).toString()
          }
        );
        secondWindow.webContents.send("crearPrestamoSuccess", data.idEmpleado);
      } else {
        for (let index = 0; index < asignacionesExistentes.length; index++) {
          if (asignacionesExistentes[index].estadoAsignacion === 'activo') {
            activos = true;
            const updateAsignacion = await Asignaciones.findByIdAndUpdate(
              asignacionesExistentes[index]._id,
              {
                cantidadPrestada: (parseInt(asignacionesExistentes[index].cantidadPrestada) + parseInt(data.cantidadPrestada)).toString(),
                fechaPrestamo: moment().format('YYYY-MM-DD') // Agregar fecha de préstamo actual al actualizar
              }
            );
            const herramientaUpdate = await Herramientas.findByIdAndUpdate(
              data.idHerramienta,
              {
                cantidadDisponible: (parseInt(herramienta.cantidadDisponible) - parseInt(data.cantidadPrestada)).toString()
              }
            );
            secondWindow.webContents.send("crearPrestamoSuccess", data.idEmpleado);
            break;
          }
        }
        if (!activos) {
          data.estadoAsignacion = 'activo';
          const newAsignacion = new Asignaciones(data);
          newAsignacion.fechaPrestamo = moment().format('YYYY-MM-DD'); // Agregar fecha de préstamo actual
          const saved = await newAsignacion.save();
          const herramientaUpdate = await Herramientas.findByIdAndUpdate(
            data.idHerramienta,
            {
              cantidadDisponible: (parseInt(herramienta.cantidadDisponible) - parseInt(data.cantidadPrestada)).toString()
            }
          );
          secondWindow.webContents.send("crearPrestamoSuccess", data.idEmpleado);
        }
      }
    }
  });

ipcMain.on('devolverHerramienta', async (e, data) => {
    let asignacion = await Asignaciones.findById(data.id);
    asignacion = JSON.parse(JSON.stringify(asignacion));
  
    // Agregar fecha de devolución actual
    asignacion.fechaDevolucion = moment().format('YYYY-MM-DD');
    
  
    let nuevoValorCantidadPrestada = (parseInt(asignacion.cantidadPrestada) - parseInt(data.cantidadADevolver)).toString();
    if (nuevoValorCantidadPrestada === '0') {
      await Asignaciones.findByIdAndUpdate(asignacion._id, { estadoAsignacion: 'inactivo' });
    } else {
      await Asignaciones.findByIdAndUpdate(asignacion._id, { cantidadPrestada: nuevoValorCantidadPrestada });
    }
    const herramienta = await Herramientas.findById(asignacion.idHerramienta);
    await Herramientas.findByIdAndUpdate(asignacion.idHerramienta, {
      cantidadDisponible: (parseInt(herramienta.cantidadDisponible) + parseInt(data.cantidadADevolver)).toString()
    });
  
    // Obtener la fecha de devolución actual
    const fechaDevolucion = moment().format('YYYY-MM-DD');
  
    // Actualizar la fecha de devolución en la asignación
    await Asignaciones.findByIdAndUpdate(asignacion._id, { fechaDevolucion });
  
    secondWindow.webContents.send('devolverHerramientaSuccess', asignacion.idEmpleado);
  });

  
//agregar createWindow
module.exports = { crearVentanaLogin }