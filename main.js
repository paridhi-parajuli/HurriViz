mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';


const container = document.querySelector('#cards-div');
        // Fetch data from the JSON file
        // TOOD: replace this
        fetch('jsonData.json')
            .then(response => response.json())
            .then(jsonData => {
                jsonData.forEach(cardData => {
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('col-md-10', 'offset-md-1');

                    const cardContent = `
                <div class="card border-primary mb-3">
                    <div class="card-header">${cardData.name}</div>
                    <div class="card-body text-primary">
                        ${cardData.details.replace('\n', '<br>')}
                    </div>
                </div>
            `;

                    cardDiv.innerHTML = cardContent;
                    container.appendChild(cardDiv);
                });
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });

        // Set the height of hurricane cards div
        const height = document.querySelector(".col-9").offsetHeight;
        document.querySelector(".col-3").style.height = height + 'px';

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
  container: 'map',
  style: "mapbox://styles/mapbox/satellite-streets-v12",
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
const dropdownYear = document.getElementById('dropdown');

/*
  displayHurricanes plots all the hurricanes for given year 
*/
function displayHurricanes(year) {
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
        if (!map.getLayer('hurricane-layer' + year + hurrName)) {
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

        if (!map.getLayer('hurricane-lines' + year + hurrName)) {
          map.addLayer({
            id: 'hurricane-lines' + year + hurrName,
            type: 'line',
            source: 'hurdat_lines',
            paint: {
              'line-color': 'white',
              'line-width': 5,
              'line-opacity': 0.5
            },
            filter: [
              'all',
              ['==', 'Year', year],
              ['==', 'Name', hurrName]
            ]
          });
        }

        map.on("click", "hurricane-layer" + year + hurrName, (e) => {
          const name = e.features[0].properties.Name; // id of the clicked state
          const intensityWS = e.features[0].properties.Intensity_WS;
          const intensityMSLP = e.features[0].properties.Intensity_MSLP;
          const year = e.features[0].properties.Year;
          const month = e.features[0].properties.Month;
          const day = e.features[0].properties.Day;

          const popup = new mapboxgl.Popup().setLngLat(e.lngLat);
          //popup.setHTML(popupTemplate(name, intensityMSLP,intensityWS,year,month,day));
          popup.setHTML(`<div>
      <strong>${name} : ${year}/${month}/${day}</strong><ul>
      <li>Total Damage :  $2M</li>
      <li>Deaths : 40</li>
      <li>ABC: 456</li>
      </ul>
      </div>`)
          console.log("here", popup);
          popup.addTo(map);

        });

        map.on("click", "hurricane-lines" + year + hurrName, (e) => {
          const name = e.features[0].properties.Name; // id of the clicked state
          const year = e.features[0].properties.Year;

          const popup = new mapboxgl.Popup().setLngLat(e.lngLat);
          //popup.setHTML(popupTemplate(name, intensityMSLP,intensityWS,year,month,day));
          popup.setHTML(`<div>
      <strong>${name} : ${year}/${month}/${day}</strong><ul>
      <li>Total Damage :  $2M</li>
      <li>Deaths : 40</li>
      <li>ABC: 456</li>
      </ul>
      </div>`)
          console.log("here", popup);
          popup.addTo(map);

        });

        map.on('mouseenter', "hurricane-lines" + year + hurrName, () => {
          map.setPaintProperty("hurricane-lines" + year + hurrName, 'line-color', "yellow");
          map.setPaintProperty("hurricane-lines" + year + hurrName, 'line-width', 10);
          map.setPaintProperty("hurricane-lines" + year + hurrName, 'line-opacity', 1);
        });

        map.on('mouseleave', "hurricane-lines" + year + hurrName, () => {
          map.setPaintProperty("hurricane-lines" + year + hurrName, 'line-color', "white");
          map.setPaintProperty("hurricane-lines" + year + hurrName, 'line-width', 3.5);
          map.setPaintProperty("hurricane-lines" + year + hurrName, 'line-opacity', 0.5);
        });

      });


    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}

//whenever HTML window is refreshed, display default select year hurricanes 
window.onload = function () {
  displayHurricanes(parseInt(dropdownYear.value));
}

//change theme based upon the selection
for (const input of themeInputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
    displayHurricanes(parseInt(dropdownYear.value));
  };
}


//plot new hurricanes when user select new year from the dropdown 
dropdownYear.addEventListener('change', () => {
  const year = parseInt(dropdownYear.value);
  displayHurricanes(year);
});
