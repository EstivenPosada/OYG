const  { app } = require("electron");
const { crearVentanaLogin } = require("./main.js");
require("./database");

app.whenReady().then(()=>{
    crearVentanaLogin();
});

try {
    require('electron-reloader')(module)
} catch (_) {

}
app.allowRendererProcessReuse = false;

