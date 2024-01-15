/**
 * GameSetUp class: Handles the setup and game flow of the memory game.
 */
class GameSetUp {
  constructor(memoryGame) {
    // The memoryGame parameter is an instance of the MemoryGame class.
    this.memoryGame = memoryGame;
  }

  // Function to show an alert with a loss message.
  showAlert() {
    alert(invalidInput);
  }

  // Function to generate a random color in hexadecimal.
  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      // Choose a random character from the letters string and append it to color.
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Function to create a specified number of buttons and add them to the container.
  createButtonsInRow(num) {
    // Get the container element where buttons will be added.
    const container = document.getElementById("buttonsContainer");
    // Clear any existing content in the container.
    container.innerHTML = ""; 

    for (let i = 0; i < num; i++) {
      // Create a new button element.
      const button = document.createElement("button");
      button.textContent = i + 1;
      button.style.backgroundColor = this.getRandomColor();
      // Add the button to the container.
      container.appendChild(button);
    }

    // Set the initial order of buttons in the memory game.
    this.memoryGame.setInitialOrder([...Array(num).keys()]);
  }

  // Function to randomly scramble the positions of the buttons.
  scrambleButtons(numScrambles) {
    // Get the container of buttons and the control panel.
    const container = document.getElementById("buttonsContainer");
    const buttons = Array.from(container.getElementsByTagName("button"));
    const controlPanel = document.getElementById("controlPanel");
    const controlPanelRect = controlPanel.getBoundingClientRect();

    let scrambleCount = 0;
    const scramble = () => {
      if (scrambleCount < numScrambles) {
        buttons.forEach((button) => {
          button.style.position = "absolute";

          let validPosition = false;
          let newX, newY;
          while (!validPosition) {
            // Generate random positions within the window boundaries.
            const maxX = window.innerWidth - button.offsetWidth;
            const maxY = window.innerHeight - button.offsetHeight;

            newX = Math.floor(Math.random() * maxX);
            newY = Math.floor(Math.random() * maxY);

            // Check if the new position doesn't overlap with the control panel.
            if (newY + button.offsetHeight < controlPanelRect.top || newY > controlPanelRect.bottom) {
              validPosition = true;
            }
          }

          // Set the new position for the button.
          button.style.left = `${newX}px`;
          button.style.top = `${newY}px`;
        });
        scrambleCount++;
        // Repeat scrambling every 2 seconds.
        setTimeout(scramble, 2000); 
      } else {
        // Re-enable the buttons and start the game after final scramble.
        buttons.forEach(button => button.disabled = false);
        this.memoryGame.hideNumbers();
        this.memoryGame.startGame();
      }
    };
    // Start the first scramble after 2 seconds.
    setTimeout(scramble, 2000);
  }

  // Event handler for the Go button click.
  onGoButtonClick() {
    // Get the number of buttons to create from the input field.
    const numInput = document.getElementById("numInput");
    const value = parseInt(numInput.value, 10);
    if (value >= 3 && value <= 7) {
      // Create buttons.
      this.createButtonsInRow(value); 

      // Disable all buttons temporarily.
      const buttons = document.getElementById("buttonsContainer").getElementsByTagName("button");
      Array.from(buttons).forEach(button => button.disabled = true);

      // Check if the previous scrambling is still in progress
      if (!this.scramblingInProgress) {
        this.scramblingInProgress = true;

        // Start scrambling the buttons after a delay.
        setTimeout(() => {
          this.scrambleButtons(value);
          // Reset the flag after scrambling is complete
          this.scramblingInProgress = false; 
        }, value * 1000);
      }
    } else {
      this.showAlert();
    }
  }
}

/**
 * MemoryGame class: Manages the logic of the memory game.
 */
class MemoryGame {
  constructor(buttonContainerId) {
    // Initialize game properties.
    this.buttonContainer = document.getElementById(buttonContainerId);
    this.initialOrder = [];
    this.clickedOrder = [];
    this.gameStarted = false;
  }

  // Set the initial order of buttons.
  setInitialOrder(order) {
    this.initialOrder = order;
  }

  // Start the memory game.
  startGame() {
    this.hideNumbers(); // Hide numbers on buttons.
    this.addClickEvents(); // Make buttons clickable.
    this.gameStarted = true; // Mark the game as started.
    this.clickedOrder = []; // Reset clicked order.
  }

  // Hide numbers on all buttons.
  hideNumbers() {
    const buttons = this.buttonContainer.querySelectorAll("button");
    buttons.forEach((button) => (button.textContent = ""));
  }

  // Add click events to buttons.
  addClickEvents() {
    const buttons = this.buttonContainer.querySelectorAll("button");
    buttons.forEach((button, index) => {
      button.onclick = () => this.handleButtonClick(index);
    });
  }

  // Handle button click events.
  handleButtonClick(index) {
    // Ignore clicks if game hasn't started.
    if (!this.gameStarted) return;
    // Add the clicked button's index to the order array.
    this.clickedOrder.push(index);
    // Check if the clicked button is in the correct sequence.
    if (this.clickedOrder[this.clickedOrder.length - 1] === this.initialOrder[this.clickedOrder.length - 1]) {
      // If correct, show the number and check for game completion.
      this.buttonContainer.children[index].textContent = this.initialOrder[index] + 1;
      if (this.clickedOrder.length === this.initialOrder.length) {
        alert(outputMessageWin);
        this.gameStarted = false;
      }
    } else {
      // If incorrect, end the game and reveal all numbers.
      this.gameStarted = false;
      this.revealAllNumbers();
      alert(outputMessageLoss); 
    }
  }

  // Reveal numbers on all buttons when the player loses.
  revealAllNumbers() {
    const buttons = this.buttonContainer.querySelectorAll("button");
    buttons.forEach((button, index) => {
      button.textContent = this.initialOrder[index] + 1;
    });
  }
}

// Initialize the game and setup event listeners.
const memoryGame = new MemoryGame("buttonsContainer");
const gameSetUp = new GameSetUp(memoryGame);

// Listen for Go button clicks and start the game setup.
document.getElementById("goButton").addEventListener("click", () => {
  gameSetUp.onGoButtonClick();
});

// The text content shown on screen.
document.getElementById("question").textContent = questionText;
document.getElementById("goButton").textContent = goButtonText;
