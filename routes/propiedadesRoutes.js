import express from "express";
import { body } from "express-validator";
import {
  admin,
  formularioCrear,
  guardar,
  agregarImagen,
  guardarImagen,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);

router.get("/propiedades/crear", protegerRuta, formularioCrear);
router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo").notEmpty().withMessage("Falta titulo"),
  body("descripcion")
    .notEmpty()
    .withMessage("Falta descripcion")
    .isLength({ max: 200 })
    .withMessage("La descripcion es muy larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona cantidad de baños"),
  body("coordenadas").notEmpty().withMessage("Selecciona una calle"),
  guardar
);

router.get("/propiedad/agregar-imagen/:id", protegerRuta, agregarImagen);
router.post(
  "/propiedad/agregar-imagen/:id",
  protegerRuta,
  //le pasamos el name del form que tiene la imagen a guardar
  upload.array("imagen", 3),
  guardarImagen
);

export default router;
