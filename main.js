mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';

const map = new mapboxgl.Map({
    container: 'map-container',
    style: "mapbox://styles/mapbox/dark-v11",
    center: [-100.786052, 36.830348],
    zoom: 2.0
  });

map.on('style.load', () => {

    map.addSource('hurdat', {
        type: 'geojson',
        data: 'data/hurdat.geojson'
      });

      map.addLayer({
        id: "all-hurricanes",
        type: "circle",
        source: 'hurdat',
        paint: {
            
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'Intensity_MSLP'], 
                882.0, 1,
                1024.0, 4
            ],
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'Intensity_WS'], 
                10.0, "blue",
                165.0, "red"
            ]
        }  ,
        filter: ['==', 'Name', "ALLEN"] , // just did ALLEN for now
      });

}); 

// change theme based upon radio button selection
const themeList = document.getElementById('theme');
const themeInputs = document.getElementsByTagName('input');
const selectedYear = document.getElementById('select-year');


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
