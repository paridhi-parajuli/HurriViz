mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';



function filterDate(geojsonUrl, columnName, targetDate) {
  return fetch(geojsonUrl)
    .then(response => response.json())
    .then(geojsonData => {
      const filteredFeatures = geojsonData.features.filter(feature => {
        return feature.properties[columnName] === targetDate;
      });

      const uniqueNames = new Set(); // Use a Set to store unique values
      filteredFeatures.forEach(feature => {
        uniqueNames.add(feature.properties.Name);
      });

      return Array.from(uniqueNames); // Return the filtered features within the promise chain
    })
    .catch(error => {
      console.error('Error fetching or parsing GeoJSON:', error);
      throw error; // Rethrow the error to continue propagating it
    });
}


const map = new mapboxgl.Map({
    container: 'map-container',
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-80.786052, 36.830348],
    zoom: 3
  });

map.on('style.load', () => {

    map.addSource('hurdat', {
        type: 'geojson',
        data: 'data/hurdat.geojson'
      });
    map.addSource('hurdat_lines', {
      type: 'geojson',
      data: "data/hurdat_line.geojson"
    });



}); 




// change theme based upon radio button selection
const themeList = document.getElementById('theme');
const themeInputs = document.getElementsByTagName('input');
const selectedYear = document.getElementById('select-year');
const dropdownYear = document.getElementById('dropdown');



dropdownYear.addEventListener('change', () => {
  const year = parseInt(dropdownYear.value);
  const allLayers = map.getStyle().layers;

  // Remove previous layers
  allLayers.forEach(layer => {
    const layerIdSubstring = layer.id.substring(0, 15);
    if ((layerIdSubstring === "hurricane-layer") || (layerIdSubstring === "hurricane-lines")) {
      map.removeLayer(layer.id);
    }
  });
  filterDate("data/hurdat.geojson", "Year", year)
  .then(filteredHurr => {
    console.log(filteredHurr);
    filteredHurr.forEach(hurrName => {
      if (! map.getLayer('hurricane-layer' + year + hurrName)){
      map.addLayer({
        id: 'hurricane-layer' + year + hurrName,
        type: 'circle',
        source: 'hurdat', 
        paint: {
                
          'circle-radius': [
              'interpolate',
              ['linear'],
              ['get', 'Intensity_MSLP'], 
              882.0, 2,
              1024.0, 4
          ],
          'circle-color': [
              'interpolate',
              ['linear'],
              ['get', 'Intensity_WS'], 
              10.0, "blue",
              165.0, "red"
          ]
        },
        filter: [
          'all', 
          ['==', 'Year', year], 
          ['==', 'Name', hurrName] 
        ]
      });
    }

      if (!map.getLayer('hurricane-lines' +year +hurrName)){
      map.addLayer({
        id: 'hurricane-lines' +year +hurrName ,
        type: 'line',
        source: 'hurdat_lines', 
        paint: {
          'line-color': 'white',
          'line-width': 1
        },
        filter: [
          'all', 
          ['==', 'Year', year], 
          ['==', 'Name', hurrName] 
        ]
      });
    }
    });

  })
  .catch(error => {
    console.error('An error occurred:', error);
  });

});






//whenever HTML window is refreshed, the default theme will be changed to
// satellite view 
window.onload = function(){
  map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
}


for (const input of themeInputs) {
  input.onclick = (layer) => {
  const layerId = layer.target.id;
  map.setStyle('mapbox://styles/mapbox/' + layerId);
};
}


//load hurricane list on the side 
selectedYear.onclick = (layer)=>{
    var selectedYearValue=layer.target.value;
    console.log(selectedYearValue);

    cards = `
        <div class="hurricane-card">
          <div class="hurricane-card-content">
            <span>Katrina</span>
            <p>Year: 2005</p>
          </div>
        </div>

        <div class="hurricane-card">
          <div class="hurricane-card-content">
            <span>Katrina</span>
            <p>Year: 2005</p>
          </div>
        </div>

        <div class="hurricane-card">
          <div class="hurricane-card-content">
            <span>Katrina</span>
            <p>Year: 2005</p>
          </div>
        </div>

        <div class="hurricane-card">
          <div class="hurricane-card-content">
            <span>Katrina</span>
            <p>Year: 2005</p>
          </div>
        </div>
    `

    document.getElementById("hurricane-list-container").innerHTML=cards;
};
