import { Categoria, Precio, Propiedad } from "../models/Index.js";

const propiedades = async (req, res) => {
  const propiedades = await Propiedad.findAll({
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });

  res.json(propiedades);
};

export { propiedades };