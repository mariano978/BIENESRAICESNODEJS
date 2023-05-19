import express from "express";
import {
  admin,
  formularioCrear,
  guardar,
  agregarImagen,
  guardarImagen,
  formularioEditar,
  guardarEdicion,
  validarFormPropiedad,
  eliminarPropiedad,
  propiedadPublic,
  enviarMensaje,
  veerMensajes,
  cambiarEstadoPropiedad,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import { identificarUsuario } from "../middleware/identificarUsuario.js";
import { body } from "express-validator";

const router = express.Router();

//Area privada
router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear", protegerRuta, formularioCrear);
router.post("/propiedades/crear", protegerRuta, validarFormPropiedad, guardar);
router.get("/propiedad/agregar-imagen/:id", protegerRuta, agregarImagen);
router.post(
  "/propiedad/agregar-imagen/:id",
  protegerRuta,
  //le pasamos el name del form que tiene la imagen a guardar
  upload.single("imagen"),
  guardarImagen
);
router.get("/propiedad/editar/:id", protegerRuta, formularioEditar);
router.post(
  "/propiedad/editar/:id",
  protegerRuta,
  validarFormPropiedad,
  guardarEdicion
);
router.post("/propiedad/eliminar/:id", protegerRuta, eliminarPropiedad);

router.get("/mensajes/:id", protegerRuta, veerMensajes);

router.put("/propiedades/:id", protegerRuta, cambiarEstadoPropiedad);

//almacenar mensaje
router.post(
  "/propiedad/:id",
  identificarUsuario,
  body("mensaje")
    .isLength({ min: 10, max: 200 })
    .withMessage("El mensaje debe tener etre 10 y 200 caracteres"),
  enviarMensaje
);

//Area publica
router.get("/propiedad/:id", identificarUsuario, propiedadPublic);

export default router;
