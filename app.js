document.addEventListener("DOMContentLoaded",() => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  // const levelDisplay = document.querySelector("#level");

  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let speed = 1000;

  const colors = [
    "#6AF63B",
    "#FFA14A",
    "#C873FF",
    "#F8CF58",
    "#7FD7F8"
  ]
  //Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 +1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 +1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino  = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * tetrominoes.length);
  let current = tetrominoes[random][currentRotation];

  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    })
  }

  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    })
  }

  function control (e){
    if(e.keyCode === 37){
      moveLeft();
    } else if(e.keyCode === 38){
      rotate();
    } else if(e.keyCode === 39){
      moveRight();
    } else if(e.keyCode === 40){
      moveDown();
    }
  }

  document.addEventListener("keyup", control);

  function moveDown () {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }



  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
      current.forEach(index => squares[currentPosition + index].classList.add("taken"))

      random = nextRandom;
      nextRandom = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveLeft () {
    undraw();
    const leftEdge = current.some(index => (currentPosition + index) % width === 0);

    if (!leftEdge) currentPosition --;

    if (current.some(index => squares[currentPosition + index].classList.contains("taken"))){
      currentPosition ++;
    }

    draw();
  }


  function moveRight () {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);

    if(!isAtRightEdge) currentPosition +=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1;
    };
    draw();
  }

  function rotate () {
    undraw();
    currentRotation ++;

    if (currentRotation === current.length){
      currentRotation = 0;
    }
    current = tetrominoes[random][currentRotation];
    draw();
  }

  const displaySquares = document.querySelectorAll(".mini-grid div");

  const displayWidth = 4;

  let displayIndex = 0;

  const nextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ]

  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });

    nextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add("tetromino")
      displaySquares[currentPosition + index].style.backgroundColor = colors[nextRandom];
    });
  }

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      timerId = setInterval(moveDown, speed);
      nextRandom = Math.floor(Math.random() * tetrominoes.length);
      displayShape();
    }
  })

document.addEventListener("keydown", (e) => {
  if (timerId && e.key === "Escape") {
    clearInterval(timerId);
    timerId = null;

  } else if (e.key === "Enter") {
    timerId = setInterval(moveDown, speed);
    nextRandom = Math.floor(Math.random() * tetrominoes.length);
    displayShape();
  }
})

  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if (row.every(index => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
      });

        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }


  //
  // function showLevel() {
  //   if (score >= 20){
  //     clearInterval(timerId);
  //     speed = 750;
  //     timerId = setInterval(moveDown, speed);
  //     levelDisplay.textContent = 2;
  //   } else if (score >= 40){
  //     clearInterval(timerId);
  //     speed = 500;
  //     timerId = setInterval(moveDown, speed);
  //     levelDisplay.textContent = 3;
  //   } else if (score >=60){
  //     clearInterval(timerId);
  //     speed = 250;
  //     timerId = setInterval(moveDown, speed);
  //     levelDisplay.textContent = 4;
  //   } else if (score >= 80){
  //     clearInterval(timerId);
  //     speed = 150;
  //     timerId = setInterval(moveDown, speed);
  //     levelDisplay.textContent = 5;
  //   }
  // }



  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
      scoreDisplay.innerHTML = "You Lost";
      clearInterval(timerId);
    }
  }
})
