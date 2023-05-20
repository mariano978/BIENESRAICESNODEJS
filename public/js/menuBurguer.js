/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*******************************!*\
  !*** ./src/js/menuBurguer.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
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

/******/ })()
;
//# sourceMappingURL=menuBurguer.js.map