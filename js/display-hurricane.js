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



function removeOtherHurricanes(hurrName, year, e) {
  const allLayers = map.getStyle().layers;
  selectedLine = "hurricane-lines" + year + hurrName;
  selectedPoints = "hurricane-layer" + year + hurrName;
  selectedDots = "hurricane-point" + year + hurrName;
  allLayers.forEach(layer => {
    const layerIdSubstring = layer.id.substring(0, 15);
    if ((layerIdSubstring === "hurricane-lines") && (layer.id != selectedLine)) {
      map.removeLayer(layer.id);
    }
    if ((layerIdSubstring === "hurricane-layer") && (layer.id != selectedPoints)) {
      map.removeLayer(layer.id);
    }
    if ((layerIdSubstring === "hurricane-point") && (layer.id != selectedDots)) {
      map.removeLayer(layer.id);
    }
  });
  map.flyTo({
    center: [e.lngLat.lng, e.lngLat.lat],
    zoom: 6,
    speed: 1,
    pitch: 60,
    bearing: 0,
    essential: true,
  });

  //const mapp = document.getElementById("map");
  popup = new mapboxgl.Popup({ className: 'custom-popup' }).setLngLat(e.lngLat);
  popup.setHTML(`
  <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
  <div>
      <strong>${hurrName}</strong>
      <span  id ="clear" style="font-size: 20px; margin-left: 5px; cursor: pointer;" >×</span>
  </div>
  <div>
      <button id="ndvi-button-pre" style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; cursor: pointer; margin-right: 5px;">Pre NDVI</button>
      <button id="ndvi-button-post" style="background-color: #007BFF; color: white; padding: 5px 10px; border: none; cursor: pointer;">Post NDVI</button>
  </div>
</div>
`)
  popup.addTo(map);

  const ndviPre = document.getElementById("ndvi-button-pre");
  const ndviPost = document.getElementById("ndvi-button-post");
  const clear = document.getElementById("clear");

  clear.addEventListener("click" ,(e)=>{
    if (map.getLayer("ndvi_pre")) {
      map.removeLayer("ndvi_pre");
    }

    if (map.getLayer("ndvi_post")) {
      map.removeLayer("ndvi_post");
    }

  });
  
  ndviPre.addEventListener("click", (event) => {
    if (map.getLayer("ndvi-post")) {
      removeLayer("ndvi-post")
    }
    if (!map.getSource("ndvi_pre")){
    map.addSource('ndvi_pre', {
      type: 'geojson',
      data: 'data/try.geojson'
    });
  }

    map.addLayer({
      id: "ndvi_pre",
      type: 'circle',
      source: 'ndvi_pre',
      paint: {
        'circle-radius': 3,
        'circle-opacity': 0.8,
        'circle-color': [
          'get',
          'color'
        ]
      }
    });
    if (map.getLayer("ndvi_pre")){
    
    map.moveLayer("ndvi_pre", selectedPoints);
    map.moveLayer("ndvi_pre", selectedLine);
    }

  });

  ndviPost.addEventListener("click", (event) => {
    if (map.getLayer("ndvi-pre")) {
      removeLayer("ndvi-pre")
    }
    if (!map.getSource("ndvi_post")){
    map.addSource('ndvi_post', {
      type: 'geojson',
      data: 'data/try_post.geojson'
    });
    }

    map.addLayer({
      id: "ndvi_post",
      type: 'circle',
      source: 'ndvi_post',
      paint: {
        'circle-radius': 3,
        'circle-opacity': 0.8,
        'circle-color': [
          'get',
          'color'
        ]
      }
    });
    if (map.getLayer("ndvi_post")){
    
    map.moveLayer("ndvi_post", selectedPoints);
    map.moveLayer("ndvi_post", selectedLine);
    }

  });

}

function rotateCamera(timestamp) {
  let bearing = (timestamp / 25) % 360;
  map.rotateTo(bearing);
  if (bearing > 359) {
    //this will fly map to right position after rotation
    map.flyTo(
      {
        center: [-80.786052, 36.830348],
        pitch: 45,
        zoom: 3.5
      }
    );
    map.setFog({});

    return;
  }
  requestAnimationFrame(rotateCamera);
}

map.on('style.load', () => {
  //rotate camera on load 
  rotateCamera(0);


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
  // map.addSource('anisbhsl.7e9jnljs', {
  //   type: "raster",
  //   "url": "mapbox://anisbhsl.7e9jnljs"
  // });

  // map.addLayer({
  //   id: "satellite-image-layer",
  //   'type': 'raster',
  //   'source': 'anisbhsl.7e9jnljs',
  // })

});

map.loadImage('images/tornado.png', (error, image) => {
  if (error) throw error;

  map.addImage('custom-icon', image);
});


const dropdownYear = document.getElementById('dropdown');

function displayHurricanes(year) {
  const allLayers = map.getStyle().layers;

  // Remove previous layers
  allLayers.forEach(layer => {
    const layerIdSubstring = layer.id.substring(0, 15);
    if ((layerIdSubstring === "hurricane-layer") || (layerIdSubstring === "hurricane-lines") || (layerIdSubstring === "hurricane-point")) {
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
              'line-opacity': 0.9
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
              ],
              'icon-size': {
                'base': 0.01,
                'stops': [
                  [3, 0.02],
                  [10, 0.08]
                ]
              },
            },
            filter: [
              'all',
              ['==', 'Year', year],
              ['==', 'Name', hurrName]
            ]
          });
        }
        if (!map.getLayer('hurricane-point' + year + hurrName)) {
          map.addLayer({
            id: 'hurricane-point' + year + hurrName,
            type: 'circle',
            source: 'hurdat',
            paint: {
              'circle-color': [
                'match',
                ['get', 'Intensity_Cat'],
                'TD', '#00FFFF',   
                'TS', '#4169E1',       
                'Cat1', '#32CD32',       
                'Cat2', '#FFFF00',   
                'Cat3', '#FFD700',   
                'Cat4', '#FF4040',   
                'Cat5', '#8B1A1A',   
                'gray'               
              ],

              'circle-radius': {
                'base': 5,
                'stops': [
                  [3, 5],
                  [10, 80]
                ]
              }
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

          popup = new mapboxgl.Popup({ closeButton: false, className: 'custom-popup' }).setLngLat(e.lngLat);
          //popup.setHTML(popupTemplate(name, intensityMSLP,intensityWS,year,month,day));
          popup.setHTML(`
          
            
          <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);">
          <strong style="font-size: 18px; color: #333;">${name} : ${year}/${month}/${day}</strong>
          <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin: 5px 0;">Category: ${cat}</li>
              <li style="margin: 5px 0;">Total Damage ($M): ${e.features[0].properties["Damage (USD in Millions)"]}</li>
              <li style="margin: 5px 0;">Deaths: ${e.features[0].properties["Deaths"]}</li>
          </ul>
      </div>
      `)
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

        map.on("click", "hurricane-layer" + year + hurrName, (e) => removeOtherHurricanes(hurrName, year, e));

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
