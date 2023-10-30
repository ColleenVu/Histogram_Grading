function init() {
    document.getElementById('fileInputBtn').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
}

//when file is loaded, delete existing figures, generate histogram and stats
function handleFileLoad(event) {
    const csvData = event.target.result;
    const bounds = defineBounds();

    deleteFigures();
    calculateMean(csvData, bounds);
    calculateMedian(csvData, bounds);
    calculateLowest(csvData, bounds);
    calculateHighest(csvData, bounds);
    calculateHistogram(csvData, bounds);
    changingInput(csvData);
}

function defineBounds() {
    const bounds = {
        "0MAX": parseFloat(document.getElementById('MAX').value),
        "Ap": parseFloat(document.getElementById('Ap').value),
        "A": parseFloat(document.getElementById('A').value),
        "Am": parseFloat(document.getElementById('Am').value),
        "Bp": parseFloat(document.getElementById('Bp').value),
        "B": parseFloat(document.getElementById('B').value),
        "Bm": parseFloat(document.getElementById('Bm').value),
        "Cp": parseFloat(document.getElementById('Cp').value),
        "C": parseFloat(document.getElementById('C').value),
        "Cm": parseFloat(document.getElementById('Cm').value),
        "D": parseFloat(document.getElementById('D').value),
        "F": parseFloat(document.getElementById('F').value)
    };
    return bounds;
}

function newLowerBounds(csvData, bounds) {

    const msgElement = document.getElementById('msg');
    msgElement.textContent = '';

    deleteFigures();
    calculateMean(csvData, bounds);
    calculateMedian(csvData, bounds);
    calculateLowest(csvData, bounds);
    calculateHighest(csvData, bounds);
    calculateHistogram(csvData, bounds);
}

function changingInput(csvData) {

    const histoInputs = document.getElementsByClassName('LBinput');
    // Loops through class LBinput and adds an event listener to each
    for (const histoInput of histoInputs) {
        histoInput.addEventListener('blur', () => {

            // Grab new input values
            const newBounds = defineBounds();

            //check for non-numeric values
            for (let count in newBounds) {
                if (isNaN(newBounds[count])) {
                    errorMsg(`Invalid input for ${count}. \n Please change the value.`);
                    deleteFigures();
                    return;
                }
            }

            // Check to see if values violate constraints
            if (newBounds["F"] >= newBounds["D"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["0MAX"] <= newBounds["Ap"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["Ap"] >= newBounds["0MAX"] || newBounds["Ap"] <= newBounds["A"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["A"] >= newBounds["Ap"] || newBounds["A"] <= newBounds["Am"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["Am"] >= newBounds["A"] || newBounds["Am"] <= newBounds["Bp"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["Bp"] >= newBounds["Am"] || newBounds["Bp"] <= newBounds["B"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["B"] >= newBounds["Bp"] || newBounds["B"] <= newBounds["Bm"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["Bm"] >= newBounds["B"] || newBounds["Bm"] <= newBounds["Cp"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["Cp"] >= newBounds["Bm"] || newBounds["Cp"] <= newBounds["C"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["C"] >= newBounds["Cp"] || newBounds["C"] <= newBounds["Cm"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["Cm"] >= newBounds["C"] || newBounds["Cm"] <= newBounds["D"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else if (newBounds["D"] >= newBounds["Cm"] || newBounds["D"] <= newBounds["F"]) {
                deleteFigures();
                errorMsg('Input value violates bound constraints. \n Please change the value.');
            } else {
                newLowerBounds(csvData, newBounds);
            }

        });
    }
}

function errorMsg(message) {
    const lbErrorMsg = message;
    const msgElement = document.getElementById('msg');
    msgElement.textContent = lbErrorMsg;
    deleteStats();
}

//clear histogram figures when changing input
function deleteFigures() {
    const elements = document.getElementsByClassName('histoclass');
    for (let i = 0; i < elements.length; i++) {
        const images = elements[i].getElementsByTagName('img');
        for (let j = images.length - 1; j >= 0; j--) {
            const image = images[j];
            image.parentNode.removeChild(image);
        }
    }
}

function deleteStats() {
    const mean = document.getElementById('meanOutput');
    const median = document.getElementById('medianOutput');
    const lowest = document.getElementById('lowestOutput');
    const highest = document.getElementById('highestOutput');
    mean.textContent = '...';
    median.textContent = '...';
    lowest.textContent = '...';
    highest.textContent = '...';
}

function calculateHistogram(csvData, bounds) {
    const lines = csvData.split("\n");
    const values = [];
    var ap = 0;
    var a = 0;
    var am = 0;
    var bp = 0;
    var b = 0;
    var bm = 0;
    var cp = 0;
    var c = 0;
    var cm = 0;
    var d = 0;
    var f = 0;

    //take values as floats and put them into the values array
    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        if (currentLine.length === 2) {
            const value = parseFloat(currentLine[1].trim());
            if (!isNaN(value)) {
                values.push(value);
            }
        }
    }

    values.forEach(value => {
        if (value >= bounds["Ap"] && value < bounds["0MAX"]) {
            ap++;
        }
        if (value >= bounds["A"] && value < bounds["Ap"]) {
            a++;
        }
        if (value >= bounds["Am"] && value < bounds["A"]) {
            am++;
        }
        if (value >= bounds["Bp"] && value < bounds["Am"]) {
            bp++;
        }
        if (value >= bounds["B"] && value < bounds["Bp"]) {
            b++;
        }
        if (value >= bounds["Bm"] && value < bounds["B"]) {
            bm++;
        }
        if (value >= bounds["Cp"] && value < bounds["Bm"]) {
            cp++;
        }
        if (value >= bounds["C"] && value < bounds["Cp"]) {
            c++;
        }
        if (value >= bounds["Cm"] && value < bounds["C"]) {
            cm++;
        }
        if (value >= bounds["D"] && value < bounds["Cm"]) {
            d++;
        }
        if (value >= bounds["F"] && value < bounds["D"]) {
            f++;
        }
    });

    const grades = {
        "Ap": ap,
        "A": a,
        "Am": am,
        "Bp": bp,
        "B": b,
        "Bm": bm,
        "Cp": cp,
        "C": c,
        "Cm": cm,
        "D": d,
        "F": f
    };

    displayHistogram(grades);
}

function displayHistogram(grades) {
    const stickman = document.createElement('img');
    stickman.src = '/imgs/stickman.png';
    stickman.width = 6;
    stickman.height = 10;

    for (const value in grades) {
        const histoCount = document.getElementById(value + '2');

        for (let i = 0; i < grades[value]; i++) {
            histoCount.appendChild(stickman.cloneNode(true));
            histoCount.appendChild(document.createTextNode(' '));
        }
    }
}

function calculateMean(csvData, bounds) {
    const data = csvData.split("\n");
    var sumGrades = 0;
    var count = 0;

    for (let i = 1; i < data.length; i++) {
        const currentLine = data[i].split(",");
        if (currentLine.length === 2) {
            const grade = parseFloat(currentLine[1].trim());
            if (grade <= bounds["0MAX"] && grade >= bounds["F"]) {
                sumGrades += grade;
                count++;
            }
        }
    }

    const mean = sumGrades / count;
    document.getElementById('meanOutput').textContent = mean.toFixed(2);
}



function calculateMedian(csvData, bounds) {
    const data = csvData.split("\n");
    const grades = [];

    for (let i = 1; i < data.length; i++) {
        const currentLine = data[i].split(",");
        if (currentLine.length === 2) {
            const grade = parseFloat(currentLine[1].trim());
            if (grade <= bounds["0MAX"] && grade >= bounds["F"]) {
                grades.push(grade);
            }
        }
    }

    grades.sort((a, b) => a - b);
    const count = grades.length;
    let median = 0;

    if (count > 0) {
        if (count % 2 === 0) {
            const mid1 = grades[count / 2 - 1];
            const mid2 = grades[count / 2];
            median = (mid1 + mid2) / 2;
        } else {
            median = grades[Math.floor(count / 2)];
        }
    }

    document.getElementById('medianOutput').textContent = median.toFixed(2);
}

function calculateLowest(csvData, bounds) {
    const data = csvData.split("\n");
    let lowestNumber = Number.MAX_VALUE;
    let lowestName = "";

    for (let i = 1; i < data.length; i++) {
        const currentLine = data[i].split(",");
        if (currentLine.length === 2) {
            const name = currentLine[0].trim();
            const grade = parseFloat(currentLine[1].trim());
            if (grade <= bounds["0MAX"] && grade >= bounds["F"] && grade < lowestNumber) {
                lowestNumber = grade;
                lowestName = name;
            }
        }
    }

    document.getElementById('lowestOutput').textContent = `${lowestNumber.toFixed(2)} (${lowestName})`;

}

function calculateHighest(csvData, bounds) {
    const data = csvData.split("\n");
    let highestNumber = Number.NEGATIVE_INFINITY;
    let highestName = "";

    for (let i = 1; i < data.length; i++) {
        const currentLine = data[i].split(",");
        if (currentLine.length === 2) {
            const name = currentLine[0].trim();
            const grade = parseFloat(currentLine[1].trim());
            if (grade <= bounds["0MAX"] && grade >= bounds["F"] && grade > highestNumber) {
                highestNumber = grade;
                highestName = name;
            }
        }
    }

    document.getElementById('highestOutput').textContent = `${highestNumber.toFixed(2)} (${highestName})`;

}