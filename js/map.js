mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: [-95, 60],  //do not change this
    pitch: 59,
    zoom: 2
});

