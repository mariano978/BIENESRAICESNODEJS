(function () {
  //lat - lng
  let coord = {
    lat: -31.745892337795638,
    lng: -60.53923534164746,
  };
  const coordPrevias = document.querySelector("[name='coordenadas']");
  if (coordPrevias.value) {
    const coordenadas = coordPrevias.value.split(",");
    coord = { lat: coordenadas[0], lng: coordenadas[1] };
    setTimeout(() => {
      resetMarkerPosition();
      mapa.setZoom(18);
    }, 0);
  }

  const mapa = L.map("mapa").setView(coord, 13);
  let marker;

  //utilizarr provider y geocoder
  const geocodeService = L.esri.Geocoding;

  resetInputBusqueda();
  function resetInputBusqueda() {
    setTimeout(() => {
      const inputBusqueda = document.querySelector(".geocoder-control-input");
      inputBusqueda.placeholder = "Búsqueda";
    }, 0);
  }

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  mapa.on("click", tomarCoordenadas);

  const searchControl = L.esri.Geocoding.geosearch({
    position: "bottomleft",
    useMapBounds: false,
    title: "Búsqueda",
  }).addTo(mapa);

  searchControl.on("results", (data) => {
    coord = data.latlng;
    resetMarkerPosition();
  });

  function tomarCoordenadas(e) {
    coord = e.latlng;
    resetMarkerPosition();
  }

  function centrarMapa() {
    mapa.panTo(new L.LatLng(coord.lat, coord.lng));
  }

  function obtenerCalles() {
    setTimeout(() => {
      geocodeService
        .reverseGeocode()
        .latlng(coord)
        .run(function (error, result) {
          document.querySelector(".calle").textContent =
            result?.address?.Address ?? "";
          document.querySelector("[name='calle']").value =
            result?.address?.Address ?? "";
          document.querySelector("[name='coordenadas']").value =
            result?.latlng.lat + ", " + result?.latlng.lng;
        });
    }, 200);
  }

  function resetMarkerPosition() {
    obtenerCalles();
    centrarMapa();
    resetInputBusqueda();
    if (marker) mapa.removeLayer(marker);
    marker = new L.marker(coord, {
      draggable: true,
      autoPan: true,
    })
      .addTo(mapa)
      .on("dragend", () => {
        //guardamos las coords cuando suelta el marcador a la hora de arrastrarlo
        coord = marker.getLatLng();
        obtenerCalles();
        centrarMapa();
        resetInputBusqueda();
      });
  }
})();
