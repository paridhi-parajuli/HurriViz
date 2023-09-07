
// Function to show hurricane category
export function getIntensityCategory(cat) {
    switch (cat) {
        case "TS":
            return "Tropical Storm";
        case "TD":
            return "Tropical Depression";
        case "Cat1":
            return "Category 1";
        case "Cat2":
            return "Category 2";
        case "Cat3":
            return "Category 3";
        case "Cat4":
            return "Category 4";
        case "Cat5":
            return "Category 5";
        default:
            return cat;
    }
}


// Function to fetch hurricane data for category
export function fetchCSV(url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {

            const lines = data.split("\n");
            const hurricaneMap = new Map();

            for (let i = 1; i < lines.length; i++) {
                const currentline = lines[i].split(",");
                const year = currentline[0];
                const name = currentline[1];
                const category = currentline[2];
                const startDate = currentline[3];
                const endDate = currentline[4];

                hurricaneMap.set(`${name}-${year}`, {category, startDate, endDate});
            }
            return hurricaneMap; // Return a map with Name-Year as the key and Category as the value
        });
}

export function stringToDate(str) {
    // Splitting the string into date and hour parts
    const [datePart, timePart] = str.split('T');
    
    // Constructing the Date object
    const date = new Date(datePart);
    
    // Adjusting the hour
    date.setHours(parseInt(timePart));
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });;
}