const { BrowserWindow, shell } = require("electron");
const { ipcMain } = require("electron");
const settings = require('electron-settings');
const path = require('path');
const url = require('url');
const fs = require('fs');
const Admins = require('../models/Admins');

let mainWindow; //
let secondWindow; //para ver vistas de detalle
let loginWindow; //primera ventana que va a ver el cliente

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
    let findAdmin = await Admins.find({email : user.email});
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
    else{
        settings.unsetSync();
  		loginWindow.webContents.send('GoogleAuthFail')
    }
});














//agregar createWindow
module.exports = { crearVentanaLogin }
