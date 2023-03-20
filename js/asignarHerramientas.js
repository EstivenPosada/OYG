const { ipcRenderer } = require("electron");

ipcRenderer.on('preview', (e,data)=>{
    console.log(data);
});