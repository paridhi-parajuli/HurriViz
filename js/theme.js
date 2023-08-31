//change theme based upon the selection
const themeInputs = document.getElementsByTagName('input');

for (const input of themeInputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
        displayHurricanes(parseInt(dropdownYear.value));
    };
}
