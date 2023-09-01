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
      filteredHurr.forEach(hurrName => {

        if (!map.getLayer('hurricane-lines' + year + hurrName)) {
          map.addLayer({
            id: 'hurricane-lines' + year + hurrName,
            type: 'line',
            source: 'hurdat_lines',
            paint: {
              'line-color': 'white',
              'line-width': {
                'base': 1,
                'stops': [
                  [3, 3],
                  [10, 12]
                ]
              },
              'line-opacity': 0.8
            },
            filter: [
              'all',
              ['==', 'Year', year],
              ['==', 'Name', hurrName]
            ]
          });
        }


        if (!map.getLayer('hurricane-layer' + year + hurrName)) {




          map.addLayer({
            id: 'hurricane-layer' + year + hurrName,
            type: 'circle',
            source: 'hurdat',
            // layout: {
            //   'icon-image': 'custom-icon',
            //   'icon-size': [
            //     'interpolate',
            //     ['linear'],
            //     ['get', 'Intensity_MSLP'],
            //     882.0, 0.01,
            //     1024.0, 0.03
            //   ]
            // },
            paint: {
              'circle-color': [
                'match',
                ['get', 'Intensity_Cat'],
                'TD', 'lightblue',   // Light color for 'TD'
                'TS', 'blue',        // Blue color for 'TS' (you can adjust the color)
                'Cat1', 'red',       // Red color for 'Cat1'
                'Cat2', 'darkred',   // Dark red color for 'Cat2'
                'Cat3', 'darkred',   // Dark red color for 'Cat3'
                'Cat4', 'darkred',   // Dark red color for 'Cat4'
                'Cat5', 'darkred',   // Dark red color for 'Cat5'
                'gray'               // Default color for other values
              ],

              'circle-radius': {
                'base': 1.75,
                'stops': [
                  [3, 2],
                  [10, 50]
                ]
              },
              //   'circle-color': [
              //     'interpolate',
              //     ['linear'],
              //     ['get', 'Intensity_WS'],
              //     10.0, "blue",
              //     165.0, "red"
              //   ]
            },
            filter: [
              'all',
              ['==', 'Year', year],
              ['==', 'Name', hurrName]
            ]
          });
        }

        var popup;

        map.on("mouseenter", "hurricane-layer" + year + hurrName, (e) => {
          const name = e.features[0].properties.Name;
          const intensityWS = e.features[0].properties.Intensity_WS;
          const intensityMSLP = e.features[0].properties.Intensity_MSLP;
          const cat = e.features[0].properties.Intensity_Cat;
          const year = e.features[0].properties.Year;
          const month = e.features[0].properties.Month;
          const day = e.features[0].properties.Day;

          popup = new mapboxgl.Popup({ closeButton: false }).setLngLat(e.lngLat);
          //popup.setHTML(popupTemplate(name, intensityMSLP,intensityWS,year,month,day));
          popup.setHTML(`<div>
      <strong>${name} : ${year}/${month}/${day}</strong><ul>
      <li>Category :  ${cat}</li>
      <li>Total Damage :  $2M</li>
      <li>Deaths : 40</li>
      <li>ABC: 456</li>
      </ul>
      </div>`)
          console.log("here", popup);
          popup.addTo(map);

        });
        map.on("mouseleave", "hurricane-layer" + year + hurrName, () => {
          if (popup) {
            popup.remove();
          }
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

