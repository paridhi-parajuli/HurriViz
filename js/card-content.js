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
                            <form id="dataForm">
                                <input type="hidden" name="cardIndex" value="${index}">
                                <div class="mb-3">
                                    <label for="windValue${index}" class="form-label">Wind Value</label>
                                    <input type="text" class="form-control" name="windValue" id="windValue${index}" placeholder="Enter wind value" required pattern="^[0-9]*\.?[0-9]*$">
                                    <div class="invalid-feedback">
                                        Please enter a valid wind value (numbers only).
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="categoryDropdown${index}" class="form-label">Category</label>
                                    <select class="form-select" id="categoryDropdown${index}"name="category" required>
                                        <option value="" selected>Choose category...</option>
                                        <option value="1">Category 1</option>
                                        <option value="2">Category 2</option>
                                        <option value="3">Category 3</option>
                                        <!-- Add other categories as needed -->
                                    </select>
                                    <div class="invalid-feedback">
                                        Please choose a category.
                                    </div>
                                </div>
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

    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });


    function handleSubmit(event) {
        event.preventDefault();

        const form = event.target.closest('.card').querySelector('form');
        const formData = new FormData(form);

        if (form.checkValidity()) {

            fetch('http://127.0.0.1:5000/data', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);    
                const modalInstance = new bootstrap.Modal(document.getElementById('iframeModal'));
                modalInstance.show();

            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            form.classList.add('was-validated');
        }
    }
// Set the height of hurricane cards div
const height = document.querySelector(".col-9").offsetHeight;
document.querySelector(".col-3").style.height = height + 'px';
