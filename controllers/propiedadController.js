import { Propiedad, Categoria, Precio } from "../models/Index.js";
import { chalk, stringObj } from "../helpers/logs.js";
import { check, validationResult } from "express-validator";
import { unlink } from "node:fs/promises";
import Paginacion from "../helpers/Paginacion.js";

const log = console.log;

const admin = async (req, res) => {
  const { id: userId } = req.usuario;
  const cantPropiedades = await countPropertiesUser(userId);

  const { pagina: currentPageNumber } = req.query;
  const paginacion = new Paginacion(cantPropiedades);

  paginacion.setCurrentPage(currentPageNumber);

  if (!paginacion.validateNumOfPage()) {
    return res.redirect("/mis-propiedades?pagina=1");
  }

  const propiedades = await findUserPropertiesByPage(userId, paginacion);

  res.render("propiedades/admin", {
    pagina: "Mis Propiedades",
    propiedades,
    csrfToken: req.csrfToken(),
    cantEnlacesPaginas: paginacion.getAmountOfPages(),
    currentPageNumber,
    limit: paginacion.getLimit(),
    offset: paginacion.getOffset(),
    cantPropiedades,
  });
};

const findUserPropertiesByPage = async (userId, paginator) => {
  const config = {
    limit: paginator.getLimit(),
    offset: paginator.getOffset(),
    where: {
      usuarioId: userId,
    },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
    order: [["updatedAt", "DESC"]],
  };

  try {
    const propiedades = await Propiedad.findAll(config);
    return propiedades;
  } catch (error) {
    console.log(error);
  }
};

const countPropertiesUser = async (userId) => {
  const config = {
    where: {
      usuarioId: userId,
    },
  };

  try {
    const cuenta = await Propiedad.count(config);
    return cuenta;
  } catch (error) {
    console.log(error);
  }
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

  //validar que la propiedad no este publicada
  if (propiedad.publicado) {
    log(chalk.red("Propiedad ya publicada"));
    return res.redirect("/mis-propiedades");
  }

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

  //validar que la propiedad no este publicada
  if (propiedad.publicado) {
    log(chalk.red("Propiedad ya publicada"));
    return res.redirect("/mis-propiedades");
  }

  //validar que la propiedad pertenezca al usuario
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    log(chalk.red(`Propiedad no pertenece al usuario ${req.usuario.nombre}`));
    return res.redirect("/mis-propiedades");
  }

  //ya podemos subir
  console.log(chalk.red("Subiendo..."));

  try {
    propiedad.imagen = req.file.filename;
    propiedad.publicado = 1;

    await propiedad.save();
    next();
  } catch (error) {
    console.log(error);
  }
};

const formularioEditar = async (req, res) => {
  try {
    const propiedadId = req.params.id;
    const currentUserId = req.usuario.id;
    const propiedad = await getPropiedadById(propiedadId, currentUserId);
    const { categorias, precios } = await getCategoriasAndPrecios();

    res.render("propiedades/editar", {
      pagina: "Editar propiedad",
      propiedad,
      categorias,
      precios,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error(error);
    res.redirect("/mis-propiedades");
  }
};

const getPropiedadById = async (propiedadId, currentUserId) => {
  const propiedad = await Propiedad.findOne({ where: { id: propiedadId } });
  if (!propiedad || propiedad.usuarioId !== currentUserId) {
    throw new Error("La propiedad no existe o no pertenece al usuario actual");
  }
  return propiedad;
};

const getCategoriasAndPrecios = async () => {
  try {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);
    return { categorias, precios };
  } catch (error) {
    throw new Error("No se pudieron obtener las categorías y los precios");
  }
};

const guardarEdicion = async (req, res) => {
  const addressForError = "mis-propiedades";
  const resultValidation = validationResult(req);
  const propertyFormData = req.body;

  if (resultValidation.isEmpty()) {
    const currentPropetyId = req.params.id;
    const currentUserId = req.usuario.id;

    const currentProperty = await getPropiedadById(
      currentPropetyId,
      currentUserId
    ).catch((error) => {
      console.log(error.message);
      res.redirect(addressForError);
    });

    await currentProperty
      .update({
        ...propertyFormData,
        categoriaId: propertyFormData.categoria,
        precioId: propertyFormData.precio,
      })
      .then(() => {
        res.redirect(addressForError);
      });
  }

  const { categorias, precios } = await getCategoriasAndPrecios().catch(
    (error) => {
      console.log(error);
      res.redirect(addressForError);
    }
  );

  res.render("propiedades/editar", {
    pagina: "Editar propiedad",
    categorias,
    precios,
    propiedad: {
      ...propertyFormData,
      categoriaId: propertyFormData.categoria,
      precioId: propertyFormData.precio,
    },
    errores: resultValidation.array(),
    csrfToken: req.csrfToken(),
  });
};

const validarFormPropiedad = async (req, res, next) => {
  await Promise.all([
    check("titulo").notEmpty().withMessage("Falta titulo").run(req),
    check("descripcion")
      .notEmpty()
      .withMessage("Falta descripcion")
      .isLength({ max: 200 })
      .withMessage("La descripcion es muy larga")
      .run(req),
    check("categoria")
      .isNumeric()
      .withMessage("Selecciona una categoria")
      .run(req),
    check("precio").isNumeric().withMessage("Selecciona un precio").run(req),
    check("habitaciones")
      .isNumeric()
      .withMessage("Selecciona cantidad de habitaciones")
      .run(req),
    check("estacionamiento")
      .isNumeric()
      .withMessage("Selecciona cantidad de estacionamientos")
      .run(req),
    check("wc")
      .isNumeric()
      .withMessage("Selecciona cantidad de baños")
      .run(req),
    check("coordenadas")
      .notEmpty()
      .withMessage("Selecciona una calle")
      .run(req),
  ]);

  next();
};

const eliminarPropiedad = async (req, res) => {
  const addressMain = "/mis-propiedades";
  const currentPropetyId = req.params.id;
  const currentUserId = req.usuario.id;

  const currentProperty = await getPropiedadById(
    currentPropetyId,
    currentUserId
  ).catch((error) => {
    console.log(error);
    res.redirect(addressMain);
  });

  await currentProperty
    .destroy()
    .then(() => {
      unlink(`public/uploads/${currentProperty.imagen}`).catch((error) => {
        console.log(error);
      });
      res.redirect(addressMain);
    })
    .catch((error) => {
      console.log(error);
      res.redirect(addressMain);
    });
};

const propiedadPublic = async (req, res) => {
  const propiedadId = req.params.id;

  const propiedad = await getPublicPropertyData(propiedadId);

  if (!propiedad) {
    res.redirect("/auth/login");
  }

  res.render("propiedades/propiedadInfoPublic", {
    propiedad,
    pagina: propiedad.titulo,
  });
};

const getPublicPropertyData = async (propiedadId) => {
  const propiedad = await Propiedad.findByPk(propiedadId, {
    include: ["categoria", "precio"],
  });

  if (!propiedad) {
    return false;
  }

  return propiedad;
};

export {
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
};
