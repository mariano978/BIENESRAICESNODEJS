import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  registrar,
  olvidePassword,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/login", formularioLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);

router.get("/recuperar-password", olvidePassword);

export default router;
