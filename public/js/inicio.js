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
/*!**************************!*\
  !*** ./src/js/inicio.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
(async function () {
  let coord = {
    lat: -31.745892337795638,
    lng: -60.53923534164746,
  };

  const mapa = L.map("mapa-inicio").setView(coord, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  const propiedades = await consultarApiPropiedades();

 


  

  function consultarApiPropiedades() {
    const urlPropiedades = "/api/propiedades";

    return fetch(urlPropiedades)
      .then((respuesta) => {
        return respuesta.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }
})();

/******/ })()
;
//# sourceMappingURL=inicio.js.map