import { Categoria, Precio, Propiedad } from "../models/Index.js";

const propiedades = async (req, res) => {
  const propiedades = await Propiedad.findAll({
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
    // order: [["createdAt", "DESC"]],
    // limit: 5
  });

  res.json(propiedades);
};

export { propiedades };
