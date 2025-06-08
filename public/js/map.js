document.addEventListener("DOMContentLoaded", function () {
  mapboxgl.accessToken = mapToken;
  const defaultCoordinates = [77.209, 28.613];
  const coords = (Array.isArray(coordinates) && coordinates.length === 2)
    ? coordinates
    : defaultCoordinates;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coords,
    zoom: 9,
  });

  new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coords)
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${title}</h3><p>${listingLocation}</p>`))
    .addTo(map);
});