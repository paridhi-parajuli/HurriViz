/*
This script controls the animation of hurricanes
along its own trajectory. 
*/
const delay = ms => new Promise(res => setTimeout(res, ms));


const animateHurricane = () => {
    delay(500);
    map.getLayer('hurricane-lines2020CRISTOBAL');

    // console.log(filterDate("data/hurdat.geojson", "Year", 2020))

    fetch("data/hurdat_line.geojson")
        .then(resp => resp.json())
        .then(geojsonData => {
            const filteredFeatures = geojsonData.features.filter(feature => {
                return feature.properties["Name"] === "CRISTOBAL";
            });
            return filteredFeatures;
        }).then(lineString => {
            console.log(lineString);

            const marker = new mapboxgl.Marker()
                .setLngLat(lineString[3].geometry.coordinates[0])
                .addTo(map);

            marker.getElement().innerHTML = '<img src="images/tornado.png" style="width: 30px; height: 30px;">';

            function animateMarker() {
                let i = 0;

                const numPoints = lineString[3].geometry.coordinates.length;

                function moveMarker() {
                    marker.setLngLat(lineString[3].geometry.coordinates[i]);
                    i++;
                    if (i <= numPoints) {
                        setTimeout(() => {
                            window.requestAnimationFrame(moveMarker);
                        }, 150);
                    }
                }
                moveMarker();
            }

            animateMarker();
        })


}

animateHurricane();
