const { ipcRenderer } = require('electron');

//Ejecutar función en el evento click
$("#btn_open").on("click", open_close_menu);

//Declaramos variables
var side_menu = document.getElementById("menu_side");
var btn_open = document.getElementById("btn_open");
var body = document.getElementById("body");
//Agregamos el menú lateral a una constante
const menuLateral = document.querySelector("div[name='menuLateral']");

//Evento para mostrar y ocultar menú
function open_close_menu() {
    body.classList.toggle("body_move");
    side_menu.classList.toggle("menu__side_move");
};

//Si el ancho de la página es menor a 760px, ocultará el menú al recargar la página

if (window.innerWidth < 760) {

    body.classList.add("body_move");
    side_menu.classList.add("menu__side_move");
};

//Haciendo el menú responsive(adaptable)

window.addEventListener("resize", function () {

    if (window.innerWidth > 760) {

        body.classList.remove("body_move");
       
    }

    if (window.innerWidth < 760) {

        body.classList.add("body_move");
        side_menu.classList.add("menu__side_move");
    }
});

const itemsMenu = [
    {
        icon: "fas fa-home",
        title: "Inicio",
        ruta: "../views/index.html",
    },
    {
        icon: "far fa-user",
        title: "Empleados",
        ruta: "../views/empleados.html"
    },
    {
        icon: "fas fa-shop",
        title: "Herramientas",
        ruta: "../views/herramientas.html"
    },
    {
        icon: "fas fa-right-from-bracket",
        title: "Logout",
        ruta: ""
    }
];

function agregarMenuLateral(itemsMenu){
    menuLateral.innerHTML +=`
                        <div id="menu_side" class="menu__side">
    
                            <div class="name__page">
                                    <i class="fab fa-youtube" title="Ingenieria" ></i>
                                    <h4> OYG INGENIERIA</h4>
                            </div>
                            <div class="options__menu">
                            </div>
                        </div>`;
    
    var optionsMenu = document.querySelector("div[class='options__menu']");                            
    
    itemsMenu.forEach(i => {
        optionsMenu.innerHTML += `
                        <a href="#" class="" id="id${i.title}" onclick="cambiarOpcion('${i.ruta}','${i.title}')">
                            <div class="option">
                                <i class="${i.icon}" title="${i.title}"></i>
                                <h4>${i.title}</h4>
                            </div>
                        </a>`;
    });                            
};

agregarMenuLateral(itemsMenu);

function cambiarOpcion(ruta,title){
    if(title!=='Logout'){
        ipcRenderer.send('change-window',{title:title, ruta:ruta});
    }else{
        if(confirm('¿Estás seguro que quieres cerrar la sesión?')){
            ipcRenderer.send('logoutGoogle');
        }
    }
};

function loader(id){
    setTimeout(()=>{$(id).addClass('selected')},300);
};

