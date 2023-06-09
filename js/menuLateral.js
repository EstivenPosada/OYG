const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');
const express = require('express');
const app = express();
const Chart = require('chart.js');
const fs = require('fs');



//Declaramos variables
var side_menu = document.getElementById("menu_side");
var btn_open = document.getElementById("btn_open");
var body = document.getElementById("body");
//Agregamos el menú lateral a una constante
const menuLateral = document.querySelector("div[name='menuLateral']");

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
        icon: "fas fa-file-pdf",
        title: "Manual",
        ruta: "../pdf/Manual_Usuario.pdf"
    },
    {
        icon: "fas fa-right-from-bracket",
        title: "Salir",
        ruta: ""
    },


];

function agregarMenuLateral(itemsMenu) {
    menuLateral.innerHTML += `
                            <header class="pt-2 font-small fixed-top" style="background: #f5f5f5;z-index: 200;height: 5rem;">
                            
                            </header>

                            <div id="menu_side" class="menu__side">
        
                                <div class="name__page">
                                        <i class="fab fa-" title="Ingenieria" ></i>
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
    if(title!=='Salir'){
        ipcRenderer.send('change-window',{title:title, ruta:ruta});
    }else{
        Swal.fire(
            {
                title: '¿Seguro que quieres cerrar sesión?',
                icon: 'question',
                confirmButtonText: 'Si',
                showDenyButton: true,
                denyButtonText: 'No',
                confirmButtonColor: '#008000',
            }
        ).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                ipcRenderer.send('logoutGoogle');
            } else if (result.isDenied) {
                Swal.close();
            };
        });
    }
};

function loader(id) {
    setTimeout(() => { $(id).addClass('selected') }, 300);
};