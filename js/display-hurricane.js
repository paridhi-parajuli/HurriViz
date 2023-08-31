var colorStops = ["#000000", "#222", "#ffc300", "#ff8d19", "#ff5733", "#ff2e00"];

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

map.on('style.load', () => {

  map.addSource('hurdat', {
    type: 'geojson',
    data: 'data/hurdat.geojson'
  });
  map.addSource('hurdat_lines', {
    type: 'geojson',
    data: "data/hurdat_line.geojson"
  });
  map.addSource('counties', {
    type: 'geojson',
    data: 'data/counties-data.geojson'
  });
});

map.loadImage('images/icon.png', (error, image) => {
  if (error) throw error;

  map.addImage('custom-icon', image);
});


const dropdownYear = document.getElementById('dropdown');

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
            type: 'symbol',
            source: 'hurdat',
            layout: {
              'icon-image': 'custom-icon',
              'icon-size': [
                'interpolate',
                ['linear'],
                ['get', 'Intensity_MSLP'],
                882.0, 0.01,
                1024.0, 0.03
              ]
            },
            // paint: {

            //   'circle-radius': [
            //     'interpolate',
            //     ['linear'],
            //     ['get', 'Intensity_MSLP'],
            //     882.0, 2,
            //     1024.0, 4
            //   ],
            //   'circle-color': [
            //     'interpolate',
            //     ['linear'],
            //     ['get', 'Intensity_WS'],
            //     10.0, "blue",
            //     165.0, "red"
            //   ]
            // },
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

//plot new hurricanes when user select new year from the dropdown 
dropdownYear.addEventListener('change', () => {
  displayHurricanes(parseInt(dropdownYear.value));
});

