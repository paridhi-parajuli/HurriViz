mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: [-80.786052, 36.830348],
    zoom: 3
});

