import express from "express";
import { admin, formularioCrear } from "../controllers/propiedadController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);

router.get("/propiedades/crear", formularioCrear);
// router.post("/propiedades/crear", crear);

export default router;
