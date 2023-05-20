(function () {
  const botonBurguer = document.querySelector("#botonBurguer");
  botonBurguer.onclick = mostrarMenu;

  function mostrarMenu() {
    const menuOculto = document.querySelector("#menuOculto");

    if (menuOculto.style.display === "none") {
      menuOculto.style.display = "block";
    }
    else{ 
        menuOculto.style.display = "none";
    }
  }

  const lupa = document.querySelector("#lupa");
  lupa.onclick = mostrarBusqueda;

  function mostrarBusqueda() {
    const busquedaHeader = document.querySelector("#busquedaHeader");

    if (busquedaHeader.style.display === "none") {
        busquedaHeader.style.display = "block";
      }
      else{ 
          busquedaHeader.style.display = "none";
      }
  }
})();
