import { Precio, Categoria, Propiedad } from "../models/Index.js";
import { validationResult } from "express-validator";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    barra: true,
  });
};

//formulario de crear
const formularioCrear = async (req, res) => {
  //consultar modelo de precios y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);
  res.render("propiedades/crear", {
    pagina: "Crear Propiedad",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardar = async (req, res) => {
  let resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);
    res.render("propiedades/crear", {
      pagina: "Crear Propiedad",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    });
  }

  //si no hay errores...
  console.log(req.body);

  const datos = {
    ...req.body,
    categoriaId: req.body.categoria,
    precioId: req.body.precio,
  };
  delete datos.precio;
  delete datos.categoria;
  
  console.log(datos);
  return;
  try {
    const propiedadGuardada = await Propiedad.create(datos);
  } catch (error) {
    console.log(error);
  }
};

export { admin, formularioCrear, guardar };
