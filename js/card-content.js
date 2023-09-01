/*
This will handle all the logic 
for card contents on the right sidebar.
*/

const container = document.querySelector('#cards-div');
const selectedDropDown = document.getElementById('dropdown');

let allData = [];  // This will hold the fetched data

// Fetch data from the JSON file once
fetch('data/hurdat.geojson')
    .then(response => response.json())
    .then(jsonData => {

        // filter out the goejson to have a single name-year record
        let uniqueNameYearSet = new Set();
        let uniqueEntries = [];

        jsonData.features.forEach(feature => {
            const name = feature.properties.Name;
            const year = feature.properties.Year;
            const key = `${name}-${year}`;

            if (!uniqueNameYearSet.has(key)) {
                uniqueNameYearSet.add(key);
                uniqueEntries.push(feature);
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
// Fetch data from the JSON file
// TODO: replace this   
function renderCardsForYear(year) {
    let filteredData = allData.filter(feature => feature.properties.Year === year);
    container.innerHTML = '';
    filteredData.forEach((cardData, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col-md-10', 'offset-md-1');

        const cardContent = `
                <div class="card border-primary mb-3">
                    <div class="card-header" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                        ${cardData.properties.Name} - ${cardData.properties.Year}
                        <i class="fas fa-chevron-down float-right"></i>
                    </div>
                    <div class="card-body text-primary">
                        Intensity Category: ${cardData.properties.Intensity_Cat}
                    </div>
                    <div class="collapse" id="collapse${index}">
                        <div class="card-body">
                            <form id="dataForm">
                                <input type="hidden" name="cardIndex" value="${index}">
                                <button type="submit" class="submit-button btn btn-primary" data-index="${index}">Show Plot</button>
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

        const cardIndexInput = form.querySelector('input[name="cardIndex"]');
        const indexValue = cardIndexInput ? cardIndexInput.value : null;

        if (indexValue) {
            const selectedName = filteredData[indexValue].properties.Name;
            const selectedYear = filteredData[indexValue].properties.Year;

            // Now, use these to set the iframe's source:
            const iframeSrc = `data/templates/${selectedYear}/${selectedYear}_${selectedName}.html`;
            document.querySelector("#iframeModal iframe").src = iframeSrc;

            // Finally, show the modal:
            const modal = new bootstrap.Modal(document.getElementById('iframeModal'));
            modal.show();
        }
    }
}
// Set the height of hurricane cards div
const height = document.querySelector(".col-9").offsetHeight;
document.querySelector(".col-3").style.height = height + 'px';



renderCardsForYear(parseInt(dropdownYear.value));
