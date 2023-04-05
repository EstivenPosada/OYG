const { ipcRenderer } = require("electron");

ipcRenderer.on('preview', (e,data)=>{
    $('#title').text(`Herramientas asignadas a ${data.empleado.nombres}`);
    console.log(data);
    setTimeout(()=>{
        $('#spinner').addClass('visually-hidden');
        $('.container').removeClass('visually-hidden');
    },1000);
});