class GameSetUp {
  constructor(memoryGame) {
    this.memoryGame = memoryGame;
  }

  showAlert() {
    alert("Invalid Input, please enter a number between 3 and 7");
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  createButtonsInRow(num) {
    const container = document.getElementById("buttonsContainer");
    container.innerHTML = "";

    for (let i = 0; i < num; i++) {
      const button = document.createElement("button");
      button.textContent = i + 1;
      button.className = "memoryButton";
      button.style.backgroundColor = this.getRandomColor();
      container.appendChild(button);
    }

    this.memoryGame.setInitialOrder([...Array(num).keys()]);
  }

  scrambleButtons(numScrambles) {
    const buttons = Array.from(document.getElementsByClassName("memoryButton"));

    let scrambleCount = 0;

    const scrambleInterval = setInterval(() => {
      if (scrambleCount >= numScrambles) {
        clearInterval(scrambleInterval);
      } else {
        buttons.forEach((button) => {
          let newX, newY, overlap;
          do {
            overlap = false;
            const maxX = window.innerWidth - button.offsetWidth;
            const maxY = window.innerHeight - button.offsetHeight;

            newX = Math.floor(Math.random() * maxX);
            newY = Math.floor(Math.random() * maxY);

            const newRect = {
              top: newY,
              left: newX,
              right: newX + button.offsetWidth,
              bottom: newY + button.offsetHeight
            };

            if (buttons.some(otherButton => otherButton !== button && this.isOverlapping(otherButton, newRect))) {
              overlap = true;
            }
          } while (overlap);

          button.classList.add("scrambledButton");
          button.style.left = `${newX}px`;
          button.style.top = `${newY}px`;
        });
        scrambleCount++;
      }
    }, 1000);
  }

  isOverlapping(element, rect) {
    const elRect = element.getBoundingClientRect();
    return !(rect.left > elRect.right || rect.right < elRect.left || rect.top > elRect.bottom || rect.bottom < elRect.top);
  }

  onGoButtonClick() {
    const numInput = document.getElementById("numInput");
    const value = parseInt(numInput.value, 10);
    if (value >= 3 && value <= 7) {
      this.createButtonsInRow(value);
      this.scrambleButtons(value);
      setTimeout(() => {
        this.memoryGame.startGame();
      }, 2000 * value);
    } else {
      this.showAlert();
    }
  }
}

class MemoryGame {
  constructor(buttonContainerId) {
    this.buttonContainer = document.getElementById(buttonContainerId);
    this.initialOrder = [];
    this.clickedOrder = [];
    this.gameStarted = false;
  }

  setInitialOrder(order) {
    this.initialOrder = order;
  }

  startGame() {
    this.hideNumbers();
    this.addClickEvents();
    this.gameStarted = true;
    this.clickedOrder = [];
  }

  hideNumbers() {
    const buttons = this.buttonContainer.querySelectorAll("button");
    buttons.forEach(button => button.textContent = '');
  }

  addClickEvents() {
    const buttons = this.buttonContainer.querySelectorAll("button");
    buttons.forEach((button, index) => {
      button.onclick = () => this.handleButtonClick(index);
    });
  }

  handleButtonClick(index) {
    if (!this.gameStarted) return;
    this.clickedOrder.push(index);
    if (this.clickedOrder[this.clickedOrder.length - 1] === this.initialOrder[this.clickedOrder.length - 1]) {
      this.buttonContainer.children[index].textContent = this.initialOrder[index] + 1;
      if (this.clickedOrder.length === this.initialOrder.length) {
        alert("Correct Order! Well done!");
        this.gameStarted = false;
      }
    } else {
      this.gameStarted = false;
      this.revealAllNumbers();
      alert("Wrong order!");
    }
  }

  revealAllNumbers() {
    const buttons = this.buttonContainer.querySelectorAll("button");
    buttons.forEach((button, index) => {
      button.textContent = this.initialOrder[index] + 1;
    });
  }
}

// Initialize and bind events
const memoryGame = new MemoryGame("buttonsContainer");
const gameSetUp = new GameSetUp(memoryGame);

document.getElementById("goButton").addEventListener("click", () => {
  gameSetUp.onGoButtonClick();
});

// Assuming these variables are defined elsewhere in your script
// const questionText = "Your question text here";
// const goButtonText = "Your button text here";
document.getElementById("question").textContent = questionText;
document.getElementById("goButton").textContent = goButtonText;
