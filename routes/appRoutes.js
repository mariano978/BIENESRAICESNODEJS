import express from "express";
import {
  index,
  errorPage,
  categoriasPage,
  buscador,
} from "../controllers/appController.js";
import { identificarUsuario } from "../middleware/identificarUsuario.js";

const router = express.Router();

router.get("/", identificarUsuario, index);

router.get("/404", identificarUsuario, errorPage);

router.get("/categorias/:id", identificarUsuario, categoriasPage);

router.post("/find", identificarUsuario, buscador);

export default router;
