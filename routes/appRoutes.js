import express from "express";
import {
  index,
  errorPage,
  categoriasPage,
  buscador,
} from "../controllers/appController.js";

const router = express.Router();

router.get("/", index);

router.get("/404", errorPage);

router.get("/categorias/:id", categoriasPage);

router.get("/find", buscador);

export default router;
