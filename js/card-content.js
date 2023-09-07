/*
This will handle all the logic 
for card contents on the right sidebar.
*/

import { fetchCSV, getIntensityCategory, stringToDate } from './utlities.js';
const container = document.querySelector('#cards-div');
const selectedDropDown = document.getElementById('dropdown');

let allData = [];  // This will hold the fetched data

// Fetch data from the JSON file once
Promise.all([
    fetch('data/hurdat.geojson').then(response => response.json()),
    fetchCSV('data/hurdat_hurricane_category_start-end_date.csv')
])
    .then(([jsonData, hurricaneMap]) => {

        // filter out the goejson to have a single name-year record
        let uniqueNameYearSet = new Set();
        let uniqueEntries = [];

        jsonData.features.forEach(feature => {
            const name = feature.properties.Name;
            const year = feature.properties.Year;
            const key = `${name}-${year}`;

            if (!uniqueNameYearSet.has(key)) {

                uniqueNameYearSet.add(key);
                if (hurricaneMap.has(key)) {
                    feature.properties.Category = hurricaneMap.get(key).category;
                    
                    feature.properties.StartDate = stringToDate(hurricaneMap.get(key).startDate);
                    feature.properties.EndDate = stringToDate(hurricaneMap.get(key).endDate);
                    feature.properties.Damage = feature.properties["Damage (USD in Millions)"];
                } else {
                    feature.properties.Category = 'Unknown'; // or some default value
                }
                uniqueEntries.push(feature);
            }
        });
        uniqueEntries.sort((a, b) => {
            if (a.properties.Year !== b.properties.Year) {
                return b.properties.Year - a.properties.Year; // sort by year
            } else if (a.properties.Month !== b.properties.Month) {
                return b.properties.Month - a.properties.Month; // if year is same, sort by month
            } else {
                return b.properties.Day - a.properties.Day; // if year and month are same, sort by day
            }
        });
        allData = uniqueEntries;

        // Initialize cards for the default selected year
        const selectedYear = parseInt(dropdownYear.value);
        renderCardsForYear(selectedYear);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

selectedDropDown.addEventListener('change', function () {
    const selectedYear = parseInt(dropdownYear.value);
    renderCardsForYear(selectedYear);
});

function renderCardsForYear(year) {
    let filteredData = allData.filter(feature => feature.properties.Year === year);
    container.innerHTML = '';
    filteredData.forEach((cardData, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col-md-10', 'offset-md-1');

        const cardContent = `
                <div class="card mb-3">
                    <div class="card-body card-body-header">
                        <div  data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                            <h4>
                                ${cardData.properties.Name}
                                <i class="fas fa-chevron-down float-right"></i>
                            </h4>
                        </div>
                        <div class="row">
                            <div class="col-md-6 ">
                                ${getIntensityCategory(cardData.properties.Category)}
                            </div>
                            <div class="col-md-6 text-end">
                            <button onclick="animateHurricane('${cardData.properties.Name}',${cardData.properties.Year})" class="btn btn-info">Animate </button>
                            </div>
                        </div>
                        <div style="font-size: 0.8em; padding:5px;">${cardData.properties.StartDate}-${cardData.properties.EndDate}</div>
                    </div>

                    <div class="collapse" id="collapse${index}">
                        <div class="card-body" style="padding-top:0px;">
                            <div><strong class="font-weight-bold">Damage (USD in Millions):  ${cardData.properties.Damage}</strong></div>
                            <div style="padding-bottom:10px;"><strong class="font-weight-bold">Deaths: ${cardData.properties.Deaths}</strong></div>
                            <form id="dataForm">
                                <input type="hidden" name="cardIndex" value="${index}">
                                <input type="hidden" name="hurricaneName" value="${cardData.properties.Name}">
                                <input type="hidden" name="hurricaneYear" value="${cardData.properties.Year}">
                                <div style="padding:5px;">
                                <label class='bold-label'>Select Visualization Type:</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="displayFormat${index}" id="intensityOption${index}" data-index="${index}" value="intensity" checked>
                                        <label class="form-check-label" for="intensityOption${index}">
                                            Hurricane Intensity
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="displayFormat${index}" id="horizontalOption${index}" data-index="${index}" value="horizontal">
                                        <label class="form-check-label" for="horizontalOption${index}">
                                            Horizontal Slice
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="displayFormat${index}" id="verticalOption${index}" data-index="${index}" value="vertical">
                                        <label class="form-check-label" for="verticalOption${index}">
                                            Vertical Cross Section
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="displayFormat${index}" id="timeOption${index}" data-index="${index}" value="time">
                                        <label class="form-check-label" for="timeOption${index}">
                                            Time-Series
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group" style="padding:5px;">
                                <div id="pressureDropdownDiv${index}">
                                    <label class='bold-label' for="pressureDropdown${index}">Select Pressure Levels</label>
                                    <select class="form-select scrollable-dropdown" id="pressureDropdown${index}" name="pressureValue">
                                        <option value="1000">1000 mb</option>
                                        <option value="950">950 mb</option>
                                        <option value="900">900 mb</option>
                                        <option value="850">850 mb</option>
                                        <option value="800">800 mb</option>
                                        <option value="750">750 mb</option>
                                        <option value="700">700 mb</option>
                                        <option value="650">650 mb</option>
                                        <option value="600">600 mb</option>
                                        <option value="550">550 mb</option>
                                        <option value="500">500 mb</option>
                                        <option value="450">450 mb</option>
                                        <option value="400">400 mb</option>
                                        <option value="350">350 mb</option>
                                        <option value="300">300 mb</option>
                                        <option value="250">250 mb</option>
                                        <option value="200">200 mb</option>
                                        <option value="150">150 mb</option>
                                        <option value="100" selected>100 mb</option>
                                    </select>
                                </div>
                                <div id="variableDropdownDiv${index}">
                                    <label class='bold-label' for="variableDropdown${index}">Select Variable</label>
                                    <select class="form-select scrollable-dropdown" id="variableDropdown${index}" name="variableValue">
                                        <option value="u10">10m_u_component_of_wind</option>
                                        <option value="v10">10m_v_component_of_wind</option>
                                        <option value="t2m">2m_temperature</option>
                                        <option value="msl">mean_sea_level_pressure</option>
                                        <option value="tp">total_precipitation</option>
                                        <option value="d" selected>divergence</option>
                                        <option value="z">geopotential</option>
                                        <option value="pv">potential_vorticity</option>
                                        <option value="r">relative_humidity</option>
                                        <option value="t">temperature</option>
                                        <option value="u">u_component_of_wind</option>
                                        <option value="v">v_component_of_wind</option>
                                        <option value="w">vertical_velocity</option>
                                        <option value="vo">vorticity</option>
                                    </select>
                                </div>
                                <div id="timeStampDropdownDiv${index}">
                                    <label class='bold-label' for="timeStampDropdown${index}">Select TimeStamp</label>
                                        <select class="form-select scrollable-dropdown" id="timeStampDropdown${index}" name="timeStampValue">
                                        <option value="2022-09-25 00:00Z">2022-09-25 00:00Z</option>
                                        <option value="2022-09-25 00:06Z">2022-09-25 00:06Z</option>
                                        <option value="2022-09-25 00:12Z">2022-09-25 00:12Z</option>
                                        <option value="2022-09-25 00:18Z">2022-09-25 00:18Z</option>
                                        <option value="2022-09-26 00:00Z">2022-09-26 00:00Z</option>
                                        <option value="2022-09-26 00:06Z">2022-09-26 00:06Z</option>
                                        <option value="2022-09-26 00:12Z">2022-09-26 00:12Z</option>
                                        <option value="2022-09-26 00:18Z">2022-09-26 00:18Z</option>
                                        <option value="2022-09-27 00:00Z">2022-09-27 00:00Z</option>
                                        <option value="2022-09-27 00:06Z">2022-09-27 00:06Z</option>
                                        <option value="2022-09-27 00:12Z">2022-09-27 00:02Z</option>
                                        <option value="2022-09-27 00:18Z">2022-09-27 00:18Z</option>
                                        <option value="2022-09-28 00:00Z">2022-09-28 00:00Z</option>
                                        <option value="2022-09-28 00:06Z">2022-09-28 00:06Z</option>
                                        <option value="2022-09-28 00:12Z">2022-09-28 00:12Z</option>
                                        <option value="2022-09-28 00:18Z">2022-09-28 00:18Z</option>
                                        <option value="2022-09-29 00:00Z">2022-09-29 00:00Z</option>
                                        <option value="2022-09-29 00:06Z">2022-09-29 00:06Z</option>
                                        <option value="2022-09-29 00:12Z">2022-09-29 00:12Z</option>
                                        <option value="2022-09-29 00:18Z">2022-09-29 00:18Z</option>
                                        <option value="2022-09-30 00:00Z">2022-09-30 00:00Z</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <button type="submit" id="showPlot${index}" class="submit-button btn btn-info" data-index="${index}">Show Plot</button>
                                    <button id="loadingBtn${index}" class="btn btn-info" type="button" disabled style="display: none;">
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                `;


        cardDiv.innerHTML = cardContent;
        container.appendChild(cardDiv);

        // as adding the form through innerHTML won't allow for event handlers
        const newButton = cardDiv.querySelector('.submit-button');
        newButton.addEventListener('click', handleSubmit);

        const radioButtons = cardDiv.querySelectorAll('.form-check-input');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', handlePlotType);
            handlePlotType({ target: radio });
        });
    });

    function handlePlotType(event){
        let index = event.target.getAttribute('data-index');
        const pressureDropdown = document.getElementById(`pressureDropdownDiv${index}`);
        const variableDropdown = document.getElementById(`variableDropdownDiv${index}`);
        const timeStampDropdown = document.getElementById(`timeStampDropdownDiv${index}`);
        
        // Default: hide all dropdowns
        pressureDropdown.style.display = 'none';
        variableDropdown.style.display = 'none';
        timeStampDropdown.style.display = 'none';
        const selectedFormat = document.querySelector(`input[name="displayFormat${index}"]:checked`).value;
    
        switch(selectedFormat) {
            case "intensity":
                // 'Intensity' only uses 'timeStampDropdown'
                timeStampDropdown.style.display = 'block';
                break;
            case "horizontal":
                // 'Intensity' only uses 'timeStampDropdown'
                pressureDropdown.style.display = 'block';
                variableDropdown.style.display = 'block';
                timeStampDropdown.style.display = 'block';
                break;
            case "vertical":
                // 'Intensity' only uses 'timeStampDropdown'
                variableDropdown.style.display = 'block';
                timeStampDropdown.style.display = 'block';
                break;
            case "time":
                // Display dropdowns for 'time'
                pressureDropdown.style.display = 'block';
                timeStampDropdown.style.display = 'block';
                break;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target.closest('.card').querySelector('form');
        const formData = new FormData(form);

        // Get the index of current clicked button
        let index = event.target.getAttribute('data-index');

        // Hide the "Show Plot" button
        // document.getElementById(`showPlot${index}`).style.display = 'none';
        // Show the loading button
        // document.getElementById(`loadingBtn${index}`).style.display = 'block';

        
        const pressureValue = document.getElementById(`pressureDropdown${index}`).value;
        const variableValue = document.getElementById(`variableDropdown${index}`).value;
        const timeStampValue = document.getElementById(`timeStampDropdown${index}`).value;
        const displayFormat = formData.get(`displayFormat${index}`);

        const formattedTimeStamp = timeStampValue.replace(/:\d{2}Z/, '').replace(/ /, 'T');

        // Construct the file name
        let jpegFileName = "";
        let modal = "";
        if (displayFormat == "time") {
            jpegFileName = `data/templates/IAN/Time-Series/TS_IAN_${variableValue}_${pressureValue}.html`;
            const iframeElement = document.querySelector("#iframeModal iframe");
            iframeElement.src = jpegFileName;
            modal = new bootstrap.Modal(document.getElementById('iframeModal'));
            modal.show();

        } else if (displayFormat == "horizontal"){
            jpegFileName = `Horizontal/IAN_${variableValue}_${pressureValue}_${formattedTimeStamp}_wind0.jpeg`;
            document.getElementById('modalImage').src = 'data/templates/IAN/' + jpegFileName;
            modal = new bootstrap.Modal(document.getElementById('jpegModal'));
            modal.show();
        } else {
            jpegFileName = "";
        }
        // document.getElementById(`loadingBtn${index}`).style.display = 'none';
        // document.getElementById(`showPlot${index}`).style.display = 'block';

        console.log('Generated JPEG file name:', jpegFileName);

        // if (form.checkValidity()) {

        //     fetch('http://127.0.0.1:8080/plotly/', {
        //         method: 'POST',
        //         body: formData
        //     })
        //         .then(response => response.text())
        //         .then(data => {
        //             // Hide the loading button
        //             document.getElementById(`loadingBtn${index}`).style.display = 'none';
        //             // Show the submit button
        //             document.getElementById(`showPlot${index}`).style.display = 'block';

        //             const iframeElement = document.querySelector("#iframeModal iframe");
        //             // Write the fetched HTML directly into the iframe's document
        //             iframeElement.contentWindow.document.open();
        //             iframeElement.contentWindow.document.write(data);
        //             iframeElement.contentWindow.document.close();

        //             // Show the modal
        //             const modalInstance = new bootstrap.Modal(document.getElementById('iframeModal'));
        //             modalInstance.show();

        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //             document.getElementById(`loadingBtn${index}`).style.display = 'none';
        //             document.getElementById(`showPlot${index}`).style.display = 'block';
        //         });
        // } else {
        //     form.classList.add('was-validated');
        //     document.getElementById(`loadingBtn${index}`).style.display = 'none';
        //     document.getElementById(`showPlot${index}`).style.display = 'block';
        // }

        // const cardIndexInput = form.querySelector('input[name="cardIndex"]');
        // const indexValue = cardIndexInput ? cardIndexInput.value : null;

        // if (indexValue) {
        //     const selectedName = filteredData[indexValue].properties.Name;
        //     const selectedYear = filteredData[indexValue].properties.Year;

        //     // Now, use these to set the iframe's source:
        //     const iframeSrc = `data/templates/${selectedYear}/${selectedYear}_${selectedName}.html`;
        //     const iframeElement = document.querySelector("#iframeModal iframe");
        //     iframeElement.src = iframeSrc;

        //     // Finally, show the modal:
        //     const modal = new bootstrap.Modal(document.getElementById('iframeModal'));
        //     modal.show();
        //     document.getElementById(`loadingBtn${index}`).style.display = 'none';
        //     document.getElementById(`showPlot${index}`).style.display = 'block';
        // }
    }
}
// Set the height of hurricane cards div
const height = document.querySelector(".col-9").offsetHeight;
document.querySelector(".col-3").style.height = height + 'px';



renderCardsForYear(parseInt(dropdownYear.value));


