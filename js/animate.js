/*
This script controls the animation of hurricanes
along its own trajectory. 
*/

// animateHurricane animates a hurricane along its own trajectory
// given the name and year of that hurricane 
const animateHurricane = (name, year) => {
    console.log("getting called!")
    fetch("data/hurdat_line.geojson")
        .then(resp => resp.json())
        .then(geojsonData => {
            const filteredFeatures = geojsonData.features.filter(feature => {
                return feature.properties["Name"] == name;
            });
            return filteredFeatures;
        })
        .then(filteredFeatures => {
            for (const feature of filteredFeatures) {
                if (feature.properties["Year"] === year) {
                    return feature;
                }
            }
        })
        .then(lineString => {
            console.log("line string", lineString);

            const marker = new mapboxgl.Marker()
                .setLngLat(lineString.geometry.coordinates[0])
                .addTo(map);

            marker.getElement().innerHTML = '<img src="images/tornado.png" style="width: 50px; height: 50px;" class="rotating-marker">';

            function animateMarker() {
                let i = 0;

                var markerActive = true;

                const numPoints = lineString.geometry.coordinates.length;

                function moveMarker() {
                    marker.setLngLat(lineString.geometry.coordinates[i]);
                    i++;
                    if (i <= numPoints) {
                        setTimeout(() => {
                            window.requestAnimationFrame(moveMarker);
                        }, 200);
                    } else {
                        markerActive = false;
                    }
                }
                moveMarker();
            }

            animateMarker();

            setTimeout(() => {
                marker.remove(); //TODO: temp fix, need to fix properly later
            }, 10000);
        })


}

// const hurricaneName = "CRISTOBAL";
// const year = 2020;
// animateHurricane(hurricaneName, year);
