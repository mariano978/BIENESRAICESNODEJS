import express from "express";
import { body } from "express-validator";
import {
  admin,
  formularioCrear,
  guardar,
} from "../controllers/propiedadController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);

router.get("/propiedades/crear", formularioCrear);
router.post(
  "/propiedades/crear",
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

export default router;
