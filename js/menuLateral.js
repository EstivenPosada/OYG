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

function cambiarOpcion(ruta, title) {
    if (title !== 'Salir') {
        ipcRenderer.send('change-window', { title: title, ruta: ruta });
    } else {
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
/* 
app.get('/dashboard', (req, res) => {
    const chartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
      datasets: [
        {
          label: 'Herramientas',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  
    const chartOptions = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
  
    const chart = new Chart('myChart', {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  
    const chartHtml = chart.toBase64Image();
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Dashboard</title>
        </head>
        <body>
          <div>
            <canvas id="myChart"></canvas>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script>
            const ctx = document.getElementById('myChart').getContext('2d');
            const chart = new Chart(ctx, ${JSON.stringify(chartData)}, ${JSON.stringify(chartOptions)});
          </script>
        </body>
      </html>
    `;
  
    fs.writeFileSync('dashboard.html', html);
  
    res.sendFile('dashboard.html', { root: __dirname });
  }); */