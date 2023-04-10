(async function () {
  let coord = {
    lat: -31.745892337795638,
    lng: -60.53923534164746,
  };

  const mapa = L.map("mapa-inicio").setView(coord, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  const propiedades = await consultarApiPropiedades();

 


  

  function consultarApiPropiedades() {
    const urlPropiedades = "/api/propiedades";

    return fetch(urlPropiedades)
      .then((respuesta) => {
        return respuesta.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }
})();
