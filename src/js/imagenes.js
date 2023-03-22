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
  autoProcessQueue: false, //evita que se suba en automatico
  dictRemoveFile: "Borrar archivo 🗑️",
  dictMaxFilesExceeded: "La cantidad max. son 3 archivos",
  headers: {
    "X-CSRF-Token": token,
  },
  //esto es el name (del form) para que multer lo pueda identificar
  paramName: "imagen",
  init: function () {
    //esto se ejecuta al iniciar dropzone
    const dropzone = this;
    const button_upload = document.querySelector("#button_upload");

    button_upload.addEventListener("click", () => {
      //procesa los archivos
      dropzone.processQueue();
    });

    // dropzone.on("queuecomplete", function () {
    //   if (dropzone.getActiveFiles().length == 0) {
    //     window.location.href = "/mis-propiedades";
    //   }
    // });
  },
});

myDropzone.on("addedfile", (file) => {
  console.log(`File added: ${file.name}`);
});
