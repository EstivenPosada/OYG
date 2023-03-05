const { ipcRenderer } = require("electron"); //ipc enviamos eventos para ser escuchados en el main



//cuando se da click que se cierre la ventana
$("#closebtn").click(function (evento) {
    ipcRenderer.send("cerrarVentana");
});

//cuando se le da click en boton login 
$("#loginGoogle").click(function (evento) {
    $("#loginGoogle").addClass('visually-hidden');
    $("#loading").removeClass('visually-hidden');
    ipcRenderer.send("Google");
});

ipcRenderer.on("GoogleAuthFail", () => {
    $("#loading").addClass('visually-hidden');
    $("#fail_login").removeClass('visually-hidden');
    setTimeout(function () {
        $("#loginGoogle").removeClass('visually-hidden');
        $("#fail_login").addClass('visually-hidden');
    }, 10000);
});

ipcRenderer.on("LoginSuccess", () => {
    $("#loading").addClass('visually-hidden');
    $("#success_login").removeClass('visually-hidden');
   /*  setTimeout(function () {
        $("#loginGoogle").removeClass('visually-hidden');
        $("#success_login").addClass('visually-hidden');
    }, 5000); */
});