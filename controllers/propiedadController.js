import { Precio, Categoria, Propiedad } from "../models/Index.js";
import { validationResult } from "express-validator";
import { chalk, stringObj } from "../helpers/logs.js";

const log = console.log;

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
    usuarioId: req.usuario.id,
    imagen: "",
  };
  delete datos.precio;
  delete datos.categoria;

  console.log(datos);

  try {
    const propiedadGuardada = await Propiedad.create(datos);
    const { id } = propiedadGuardada;
    res.redirect(`/propiedad/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id: propiedadId } = req.params;

  //validar propiedad
  const propiedad = await Propiedad.findByPk(propiedadId);

  if (!propiedad) {
    log(chalk.red("Propiedad inexistente"));
    return res.redirect("/mis-propiedades");
  }

  log(chalk.yellow(`Propiedad: ${stringObj(propiedad.dataValues)}`));

  //validar que la propiedad no este publicada
  if (propiedad.publicado) {
    log(chalk.red("Propiedad ya publicada"));
    return res.redirect("/mis-propiedades");
  }

  log(chalk.yellow(`Usuario: ${stringObj(req.usuario)}`));

  //validar que la propiedad pertenezca al usuario
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    log(chalk.red(`Propiedad no pertenece al usuario ${req.usuario.nombre}`));
    return res.redirect("/mis-propiedades");
  }

  //si es su propiedad...
  log(chalk.green("Propiedad válida"));

  res.render("propiedades/agregar-imagen", {
    pagina: `Añadir Imagen para ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const guardarImagen = async (req, res, next) => {
  const { id: propiedadId } = req.params;

  //validar propiedad
  const propiedad = await Propiedad.findByPk(propiedadId);

  if (!propiedad) {
    log(chalk.red("Propiedad inexistente"));
    return res.redirect("/mis-propiedades");
  }

  log(chalk.yellow(`Propiedad: ${stringObj(propiedad.dataValues)}`));

  //validar que la propiedad no este publicada
  if (propiedad.publicado) {
    log(chalk.red("Propiedad ya publicada"));
    return res.redirect("/mis-propiedades");
  }

  log(chalk.yellow(`Usuario: ${stringObj(req.usuario)}`));

  //validar que la propiedad pertenezca al usuario
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    log(chalk.red(`Propiedad no pertenece al usuario ${req.usuario.nombre}`));
    return res.redirect("/mis-propiedades");
  }

  //si es su propiedad...
  log(chalk.green("Propiedad válida"));

  //ya podemos subir
  console.log(chalk.red("Subiendo..."));

  try {
    console.log(chalk.cyan(`req.files => + ${stringObj(req.files)}`));
    //almacenar imagen y publicar propiedad
    // if (propiedad.imagen) {
    //   propiedad.imagen = [propiedad.imagen, req.file.filename].join(",");
    // } else {
    //   propiedad.imagen = req.file.filename;
    // }

    //propiedad.publicado = 1;
    //guardamos en la BD
    //await propiedad.save();
    //next();
  } catch (error) {
    console.log(error);
  }
};

export { admin, formularioCrear, guardar, agregarImagen, guardarImagen };
