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
/*!******************************************!*\
  !*** ./src/js/cambiarEstadoPropiedad.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
(function () {
  const btnsPublicado = document.querySelectorAll("#btnPublicado");
  const csrfToken = document
    .querySelector("meta[name='csrf-token']")
    .getAttribute("content");

  btnsPublicado.forEach((btnPublicado) => {
    btnPublicado.onclick = cambiarEstado;
  });

  async function cambiarEstado(event) {
    const { propiedadId } = event.target.dataset;
    const url = `/propiedades/${propiedadId}`;

    try {
      const respuesta = await fetch(url, {
        method: "PUT",
        headers: {
          "CSRF-Token": csrfToken,
        },
      });

      const resultado = await respuesta.json();

      if (resultado) {
        const botonClickeado = event.target;
        //si tenemos un resultado le cambiamos la clase al boton que clickeamos
        const estadoPublicado =
          botonClickeado.classList.contains("bg-green-200");
        //el estado sera publicado si el color del boton es verde
        if (estadoPublicado) {
          botonClickeado.classList.remove("bg-green-200", "text-green-500");
          botonClickeado.classList.add("bg-yellow-200", "text-yellow-600");
          botonClickeado.textContent = "No publicado";
        } else {
          //si no esta publicado
          botonClickeado.classList.remove("bg-yellow-200", "text-yellow-600");
          botonClickeado.classList.add("bg-green-200", "text-green-500");
          botonClickeado.textContent = "Publicado";
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
})();

/******/ })()
;
//# sourceMappingURL=cambiarEstadoPropiedad.js.map