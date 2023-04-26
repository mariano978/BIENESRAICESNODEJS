(async function () {
  let coord = {
    lat: 0,
    lng: 0,
  };
  const coordHTML = document.querySelector("#coordenadas").textContent;
  [coord.lat, coord.lng] = coordHTML.split(",");

  const mapa = L.map("mapa", {
    center: coord,
    zoom: 17,
  });

  const tilesProvider = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(tilesProvider, {
    maxZoom: 18,
  }).addTo(mapa);

  const marker = new L.marker(coord).addTo(mapa);
})();
