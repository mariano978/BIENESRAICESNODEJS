import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import 'tippy.js/themes/material.css';

tippy("#ayuda_mapa", {
  content: "Si en la busqueda no da la posicion exacta, intenta mover el pin manualmente un poco !",
  arrow: true,
  theme: "material",
});
