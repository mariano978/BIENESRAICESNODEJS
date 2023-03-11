import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  registrar,
  formulariOlvidePassword,
  confirmarCuenta,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  autenticarLogin,
} from "../controllers/usuarioController.js";

const router = express.Router();

//Cuentas
router.get("/login", formularioLogin);
router.post("/login", autenticarLogin);

router.get("/registro", formularioRegistro);
router.post("/registro", registrar);
router.get("/confirmar/:token", confirmarCuenta);

router.get("/recuperar-password", formulariOlvidePassword);
router.post("/recuperar-password", resetPassword);
router.get("/recuperar-password/:token", comprobarToken);
router.post("/recuperar-password/:token", nuevoPassword);

export default router;
