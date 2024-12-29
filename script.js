const matrix = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''], 
].reduce((accum, item, index) => {
    const quantityOfNumbers = getRandomInt(3, 7);
    const indices = getRandomNumbers(0, 9).slice(0, quantityOfNumbers+1);
    const randomNumbers = getRandomNumbers(1, 10).slice(0, quantityOfNumbers+1);



    for (let i = 0; i < quantityOfNumbers; i++) {
        let before = [...item];
        item[indices[i]] = randomNumbers[i];
        checkComplianceWithTheRules(before, [...item])
    }

    accum.push(item);
    return accum;
}, []);

const table = document.getElementById('table');
table.addEventListener('click', clickHandler);

for (let i = 0; i < matrix.length; i++) {
    let tr = document.createElement('tr');
    let elems = [];

    for (let j = 0; j < matrix.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = matrix[i][j];
        td.dataset.index = i*9 + j;
        elems.push(td);
    }

    tr.append( ...elems );
    table.append(tr);
}


// styling
stylyBorder();

//----------------------------------------------------------------------------------

function clickHandler(event) {
    const elemsObject = getElementLines(event.target);

    // styling
    switchTdStyles(elemsObject);
}

function getElementLines(target) {
    const index = +target.dataset.index + 1;
    const horizontalElems = [...target.parentElement.children];

    const verticalElems = [];
    for (let i = 0; i < table.rows.length; i++) {
        verticalElems.push( table.rows[i].children[target.cellIndex] )
    }


    let cubeElems = [];
    let trLines = [];
    const trNumber = Math.ceil(index/9);
    const tdNumber = index % 9;

    if (trNumber > 0 && trNumber < 4) {
        trLines.push( [...table.rows].slice(0, 3) )
    } else if (trNumber > 3 && trNumber < 7) {
        trLines.push( [...table.rows].slice(3, 6) )
    } else {
        trLines.push( [...table.rows].slice(6) )
    }
    trLines = [].concat(...trLines)

    for (let i = 0; i < trLines.length; i++) {
        if (tdNumber > 0 && tdNumber < 4) {
            cubeElems.push( [...trLines[i].children].slice(0, 3) )
        } else if (tdNumber > 3 && tdNumber < 7) {
            cubeElems.push( [...trLines[i].children].slice(3, 6) )
        } else {
            cubeElems.push( [...trLines[i].children].slice(6) )
        }
    }
    cubeElems = [].concat(...cubeElems);


    console.log(target)
    console.log(verticalElems.map(elem => elem.innerHTML));
    console.log(horizontalElems.map(elem => elem.innerHTML));
    console.log(cubeElems.map(elem => elem.innerHTML));

    return {
        target: target,
        elems: [...cubeElems, ...verticalElems, ...horizontalElems]
    };
}


function getMatrixLines(target, arrIndex, itemIndex) {

}


function checkComplianceWithTheRules(beforeMake, afterMake) {
    console.log([beforeMake, afterMake]);
    
}
//--------------------------------------------------------------------------------------------------------------------------

function getRandomNumbers(from, to) {
    const range = [...Array(to - from).keys()].map(v => v + from);

    for (let i = 1; i < range.length; ++i) {
        const j = Math.floor(Math.random() * (i + 1));
        [range[i], range[j]] = [range[j], range[i]];  // Максимум не включается, минимум включается
    }

    return range;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
}

//--------------------------------------------------------------------------------------------------------------------------

function stylyBorder() {
    for (let i = 0; i < 9; i++) {
        table.rows[i].children[2].classList.add("td-rigth");
    }

    for (let i = 0; i < 9; i++) {
        table.rows[i].children[5].classList.add("td-rigth");
    }

    for (let i = 0; i < 9; i++) {
        table.rows[2].children[i].classList.add("td-bottom");
    }

    for (let i = 0; i < 9; i++) {
        table.rows[5].children[i].classList.add("td-bottom");
    }
}

function switchTdStyles(obj) {
    document.querySelectorAll('td').forEach(item => item.classList.remove('td-passive', 'td-active'));

    obj.elems.forEach(item => item.classList.add('td-passive'));
    obj.target.classList.add('td-active');
}