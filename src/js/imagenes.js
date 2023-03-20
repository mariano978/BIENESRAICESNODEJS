import Dropzone from "dropzone";
import { stringObj, chalk } from "../../helpers/logs.js";

const token = document.querySelector("[name=_csrf]").value;

const myDropzone = new Dropzone("#imagenes", {
  dictDefaultMessage: "Sube tus imagenes aqui...",
  addRemoveLinks: true,
  maxFiles: 3,
  maxFilesize: 5,
  acceptedFiles: ".png,.jpg,.jpng",
  parallelUploads: 3,
  autoProcessQueue: true, //evita que se suba en automatico
  dictRemoveFile: "Borrar archivo 🗑️",
  dictMaxFilesExceeded: "La cantidad max. son 3 archivos",
  headers: {
    "X-CSRF-Token": token,
  },
  //esto es el name (del form) para que multer lo pueda identificar
  paramName: "imagen",
});

myDropzone.on("addedfile", (file) => {
  console.log(`File added: ${file.name}`);
});
