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
/*!****************************!*\
  !*** ./src/js/mapaFijo.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
(async function () {
  let coord = {
    lat: 0,
    lng: 0,
  };
  const coordHTML = document.querySelector("#coordenadas").textContent;
  [coord.lat, coord.lng] = coordHTML.split(",");

  const mapa = L.map("mapa", {
    center: coord,
    zoom: 17,
  });

  const tilesProvider = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(tilesProvider, {
    maxZoom: 18,
  }).addTo(mapa);

  const marker = new L.marker(coord).addTo(mapa);
})();

/******/ })()
;
//# sourceMappingURL=mapaFijo.js.map