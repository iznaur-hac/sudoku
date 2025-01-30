const startGameBtn = document.getElementById('startGame');

startGameBtn.addEventListener('click', startGame, {once: true});

function startGame() {
  startGameBtn.classList.add('none');
  createTable();
  document.querySelector('.player-interface').classList.remove('none');

  const modalWindow = document.getElementById('modal-window');
  const buttons = document.querySelector('.player-interface__buttons');
  const attempts = document.getElementById('attempts').firstElementChild;
  const table = document.getElementById('table');

  const sudoku = createSudokuMatrix();
  console.log(sudoku);

  // const startingSudoku = sudoku;
  const startingSudoku = sudoku.map(row => {
    const quantityOfSpaces = getRandomInt(3, 6);
    const indices = getRandomNumbers(0, 9).slice(0, quantityOfSpaces);

    const newRow = [...row]

    for (let index of indices) {
      newRow[index] = '';
    }

    return newRow;
  });

  let activeTd;
  let errors = 3;

  generateTable();

  table.addEventListener('click', clickHandler);
  startingTdInitialization();
  buttons.addEventListener('click', setTdValue);

  //---------------------------------------------------------------------------------------

  attempts.innerHTML = errors;

  function generateTable() {
    for (let i = 0; i < startingSudoku.length; i++) {
      let tr = document.createElement('tr');
      let elems = [];
    
      for (let j = 0; j < startingSudoku.length; j++) {
          let td = document.createElement('td');
          td.innerHTML = startingSudoku[i][j];
          if (startingSudoku[i][j]) {
            td.dataset.changed = false;
          } else {
            td.dataset.changed = true;
          }
          td.dataset.index = i*9 + j;
          elems.push(td);
      }
    
      tr.append( ...elems );
      table.append(tr);
    }

    // styling
    stylyBorder();
  }


  //----------------------------------------------------------------------------------

  function clickHandler(event) {
    const elemsObject = getElementLines(event.target);
    console.log("работает");

    activeTd = event.target;

    // styling
    switchTdStyles(elemsObject);
  }

  function startingTdInitialization() {
    const event = new Event("click", {bubbles: true});
    const firstTd = table.firstElementChild.firstElementChild;
    firstTd.dispatchEvent(event);
  }

  function setTdValue(event) {
    const button = event.target.closest('button');

    if (JSON.parse(activeTd.dataset.changed)) {
      const tdIndex = activeTd.dataset.index;
      const btnValue = button.dataset.value;
      
      activeTd.innerHTML = button.dataset.value;
      if (btnValue != sudoku[(tdIndex - (tdIndex%9)) / 9][tdIndex % 9]) {
        attempts.innerHTML = --errors;
        activeTd.classList.add('td-error');
      } else {
        activeTd.dataset.changed = false;
        activeTd.classList.remove('td-error');
      }

      if (errors === 0) modalWindow.showModal();
    }
  }


  //--------------------------------------------------------------------------------------------------------------------------


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


    // console.log(verticalElems.map(elem => elem.innerHTML));
    // console.log(horizontalElems.map(elem => elem.innerHTML));
    // console.log(cubeElems.map(elem => elem.innerHTML));

    return {
        target: target,
        elems: [...cubeElems, ...verticalElems, ...horizontalElems]
    };
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

  //--------------------------------------------------------------------------------------------------------------------------

  function createSudokuMatrix() {
    const matrix = Array.from({length:9}, () => Array(9).fill(0));

    function shuffleArray(array) {
      let result = [...array];
      for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }

    function isRight(matrix, row, colum, num) {
      for (let x = 0; x < 9; x++) {
        if (matrix[row][x] === num || matrix[x][colum] === num) {
          return false;
        }
      }

      const cubeRowStart = row - row % 3;
      const cubeColumStart  = colum - colum % 3; 
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (matrix[cubeRowStart + i][cubeColumStart + j] == num) {
            return false;
          }
        }
      }

      return true;
    }
  
    function fillMatrix() {
      const pattern = '0681594327597283416342671589934157268278936145156842973729318654813465792465729831';
      const randomNums = shuffleArray([1,2,3,4,5,6,7,8,9]);
      
      let j = 0;
      for (let i = 1; i < 82; i++) {

        if (j % 9 === 0) j = 0;

        if (i % 9 === 0) {
          matrix[((i - 9) - i % 9) / 9][j] = randomNums[pattern.substr(i, 1) - 1];
        } else {
          matrix[(i - i % 9) / 9][j] = randomNums[pattern.substr(i, 1) - 1];
        }

        j++;
      }
    }

    fillMatrix();
    return matrix;
  }

  function createTable() {
    const table = document.createElement('table');
    table.id = "table";
    document.querySelector(".sudoku-box").prepend(table);
  }
}