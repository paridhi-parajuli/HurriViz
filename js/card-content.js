/*
This will handle all the logic 
for card contents on the right sidebar.
*/

import { fetchCSV, getIntensityCategory } from './utlities.js';
const container = document.querySelector('#cards-div');
const selectedDropDown = document.getElementById('dropdown');

let allData = [];  // This will hold the fetched data

// Fetch data from the JSON file once
Promise.all([
    fetch('data/hurdat.geojson').then(response => response.json()),
    fetchCSV('data/HURDAT_hurricane_category.csv')
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
                    feature.properties.Category = hurricaneMap.get(key);
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
                    <div class="card-body card-body-header" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                        <h4>
                            ${cardData.properties.Name}
        
                            <i class="fas fa-chevron-down float-right"></i>
                        </h4>
                        <div class="row">
                            <div class="col-md-8">
                                <button onclick="animateHurricane('${cardData.properties.Name}',${cardData.properties.Year})" class="btn btn-info">Animate </button>
                            </div>
                            <div class="col-md-4">
                                ${getIntensityCategory(cardData.properties.Category)}
                            </div>
                        </div>
                        <div style="font-size: 0.8em;">${cardData.properties.Year}-${cardData.properties.Month}-${cardData.properties.Day}</div>

                    </div>
                    <div class="collapse" id="collapse${index}">
                        <div class="card-body" style="padding-top:0px;">
                            <div>Damage: </div>
                            <div style="padding-bottom:10px;">Deaths: </div>
                            <form id="dataForm">
                                <input type="hidden" name="cardIndex" value="${index}">
                                <input type="hidden" name="hurricaneName" value="${cardData.properties.Name}">
                                <input type="hidden" name="hurricaneYear" value="${cardData.properties.Year}">
                                
                                <button type="submit" id="showPlot${index}" class="submit-button btn btn-primary" data-index="${index}">Show Plot</button>
                                <button id="loadingBtn${index}" class="btn btn-primary" type="button" disabled style="display: none;">
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
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
    });


    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target.closest('.card').querySelector('form');
        const formData = new FormData(form);

        // Get the index of current clicked button
        let index = event.target.getAttribute('data-index');

        // Hide the "Show Plot" button
        document.getElementById(`showPlot${index}`).style.display = 'none';
        // Show the loading button
        document.getElementById(`loadingBtn${index}`).style.display = 'block';

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

        const cardIndexInput = form.querySelector('input[name="cardIndex"]');
        const indexValue = cardIndexInput ? cardIndexInput.value : null;

        if (indexValue) {
            const selectedName = filteredData[indexValue].properties.Name;
            const selectedYear = filteredData[indexValue].properties.Year;

            // Now, use these to set the iframe's source:
            const iframeSrc = `data/templates/${selectedYear}/${selectedYear}_${selectedName}.html`;
            const iframeElement = document.querySelector("#iframeModal iframe");
            iframeElement.src = iframeSrc;

            // Finally, show the modal:
            const modal = new bootstrap.Modal(document.getElementById('iframeModal'));
            modal.show();
            document.getElementById(`loadingBtn${index}`).style.display = 'none';
            document.getElementById(`showPlot${index}`).style.display = 'block';
        }
    }
}
// Set the height of hurricane cards div
const height = document.querySelector(".col-9").offsetHeight;
document.querySelector(".col-3").style.height = height + 'px';



renderCardsForYear(parseInt(dropdownYear.value));
