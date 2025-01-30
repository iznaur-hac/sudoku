const startGameBtn = document.getElementById('startGame');
const modalWindow = document.getElementById('modal-window');


const generation = {
  pattern: '0681594327597283416342671589934157268278936145156842973729318654813465792465729831',
  randomNums: shuffleArray([1,2,3,4,5,6,7,8,9]),
  activeTd: null,
  errors: 3,
  table: document.getElementById('table'),
  sudoku: Array.from({length:9}, () => Array(9).fill(0)),

  SudokuWithBlanks: this.sudoku.map(row => {
      const quantityOfSpaces = getRandomInt(3, 6);
      const indices = getRandomNumbers(0, 9).slice(0, quantityOfSpaces);
  
      const newRow = [...row]
  
      for (let index of indices) {
        newRow[index] = '';
      }
  
      return newRow;
  }),

  
  fillMatrix() {
      let j = 0;
      for (let i = 1; i < 82; i++) {

        if (j % 9 === 0) j = 0;

        if (i % 9 === 0) {
          this.sudoku[((i - 9) - i % 9) / 9][j] = this.randomNums[pattern.substr(i, 1) - 1];
        } else {
          this.sudoku[(i - i % 9) / 9][j] = this.randomNums[pattern.substr(i, 1) - 1];
        }

        j++;
      }
  },

  startingTdInitialization() {
      const event = new Event("click", {bubbles: true});
      const firstTd = table.firstElementChild.firstElementChild;
      firstTd.dispatchEvent(event);
  },

  getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
  },

  getRandomNumbers(from, to) {
      const range = [...Array(to - from).keys()].map(v => v + from);
  
      for (let i = 1; i < range.length; ++i) {
          const j = Math.floor(Math.random() * (i + 1));
          [range[i], range[j]] = [range[j], range[i]];  // Максимум не включается, минимум включается
      }
  
      return range;
  },

  setTdValue(event) {
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
  },

  generateTable() {
    for (let i = 0; i < this.startingSudoku.length; i++) {
      let tr = document.createElement('tr');
      let elems = [];
    
      for (let j = 0; j < this.startingSudoku.length; j++) {
          let td = document.createElement('td');
          td.innerHTML = this.startingSudoku[i][j];
          if (this.startingSudoku[i][j]) {
            td.dataset.changed = false;
          } else {
            td.dataset.changed = true;
          }
          td.dataset.index = i*9 + j;
          elems.push(td);
      }
    
      tr.append( ...elems );
      this.table.append(tr);
    }

    stylyBorder();
  },

  createTable() {
      const table = document.createElement('table');
      table.id = "table";
      document.querySelector(".sudoku-box").prepend(table);
  },

  stylyBorder() {
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
  },

  clickHandler(event) {
      const elemsObject = getElementLines(event.target);
      console.log("работает");
  
      this.activeTd = event.target;
  
      // styling
      this.switchTdStyles(elemsObject);
  },

  switchTdStyles(obj) {
      document.querySelectorAll('td').forEach(item => item.classList.remove('td-passive', 'td-active'));
  
      obj.elems.forEach(item => item.classList.add('td-passive'));
      obj.target.classList.add('td-active');
  },

  init() {
    startGameBtn.classList.add('none');
    createTable();
    document.querySelector('.player-interface').classList.remove('none');

    const buttons = document.querySelector('.player-interface__buttons');
    const attempts = document.getElementById('attempts').firstElementChild;
      
    this.generateTable();
  
    this.table.addEventListener('click', this.clickHandler);
    startingTdInitialization();
    buttons.addEventListener('click', this.setTdValue);
  
  
    attempts.innerHTML = this.errors;
  }
}

startGameBtn.addEventListener('click', generation.init, {once: true});

function shuffleArray(array) {
  let result = [...array];
  for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// function isRight(sudoku, row, colum, num) {
  //     for (let x = 0; x < 9; x++) {
  //       if (this.sudoku[row][x] === num || this.sudoku[x][colum] === num) {
  //         return false;
  //       }
  //     }

  //     const cubeRowStart = row - row % 3;
  //     const cubeColumStart  = colum - colum % 3; 
      
  //     for (let i = 0; i < 3; i++) {
  //       for (let j = 0; j < 3; j++) {
  //         if (this.sudoku[cubeRowStart + i][cubeColumStart + j] == num) {
  //           return false;
  //         }
  //       }
  //     }

  //     return true;
  //   }
  
  //   fillMatrix();
  //   return this.sudoku;
  