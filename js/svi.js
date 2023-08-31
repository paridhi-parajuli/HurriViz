const isSVI = document.getElementById("svi-checkbox");

const displaySVI = () => {
    console.log("ok", isSVI.checked);

    if (isSVI.checked) {
        map.addLayer({
            id: 'svi',
            type: 'fill',
            source: 'counties',
            paint: {
                'fill-color': {
                    property: 'RPL_THEMES_2020',
                    stops: [
                        [0.100, colorStops[2]],
                        [0.30, colorStops[3]],
                        [0.60, colorStops[4]],
                        [1.0, colorStops[5]]
                    ]
                },
                'fill-opacity': 0.7
            }
        });
    }
    else {
        if (map.getLayer("svi")) {
            map.removeLayer("svi");
        }
    }
}

isSVI.addEventListener("change", () => {
    console.log("ok", isSVI.checked);
    displaySVI();
});
