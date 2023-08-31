/*
This will handle all the logic 
for card contents on the right sidebar.
*/

const container = document.querySelector('#cards-div');
// Fetch data from the JSON file
// TODO: replace this
fetch('data/jsonData.json')
    .then(response => response.json())
    .then(jsonData => {
        jsonData.forEach((cardData, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('col-md-10', 'offset-md-1');

            const cardContent = `
            <div class="card border-primary mb-3">
            <div class="card-header" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                ${cardData.name}
                <i class="fas fa-chevron-down float-right"></i>
            </div>
            <div class="card-body text-primary">
                ${cardData.details.replace('\n', '<br>')}
            </div>
            <div class="collapse" id="collapse${index}">
                <div class="card-body">
                    <form>
                        <div class="mb-3">
                            <label for="windValue${index}" class="form-label">Wind Value</label>
                            <input type="text" class="form-control" id="windValue${index}" placeholder="Enter wind value">
                        </div>
                        <div class="mb-3">
                            <label for="categoryDropdown${index}" class="form-label">Category</label>
                            <select class="form-select" id="categoryDropdown${index}">
                                <option selected>Choose category...</option>
                                <option value="1">Category 1</option>
                                <option value="2">Category 2</option>
                                <option value="3">Category 3</option>
                                <!-- Add other categories as needed -->
                            </select>
                        </div>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#iframeModal">Show Plot</button>

                    </form>
                </div>
            </div>
        </div>
    `;


            cardDiv.innerHTML = cardContent;
            container.appendChild(cardDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

// Set the height of hurricane cards div
const height = document.querySelector(".col-9").offsetHeight;
document.querySelector(".col-3").style.height = height + 'px';
