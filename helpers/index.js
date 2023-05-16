const esVendedor = (usuarioId, propiedadUsuarioId) => {
  return usuarioId === propiedadUsuarioId;
};

const formatearFecha = (fecha) => {
  const opcionesFecha = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const opcionesHora = {
    hour: "numeric",
    minute: "numeric",
  };

  const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora);

  return `${fechaFormateada} a las ${horaFormateada}`;
};

export { esVendedor, formatearFecha };
