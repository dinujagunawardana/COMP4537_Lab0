class Button {
  // Input validation
  showAlert() {
    alert("Invalid Input, please enter a number between 3 and 7");
  }

  // Get a random color
  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Create buttons in a single row
  createButtonsInRow(num) {
    const container = document.getElementById("buttonsContainer");
    container.innerHTML = "";
    container.style.display = "flex";

    for (let i = 0; i < num; i++) {
      const button = document.createElement("button");
      button.textContent = i + 1;
      button.style.backgroundColor = this.getRandomColor();
      button.style.height = "5em";
      button.style.width = "10em";
      button.style.marginRight = "5px";
      button.style.position = "relative";

      container.appendChild(button);
    }
  }

  //Scramble the buttons 
  scrambleButtons(numScrambles) {
    const container = document.getElementById("buttonsContainer");
    const buttons = Array.from(container.getElementsByTagName("button"));
  
    let scrambleCount = 0;
  
    const scrambleInterval = setInterval(() => {
      if (scrambleCount >= numScrambles) {
        clearInterval(scrambleInterval);
      } else {
        buttons.forEach((button) => {
          const maxX = window.innerWidth - button.offsetWidth;
          const maxY = window.innerHeight - button.offsetHeight;
  
          const newX = Math.floor(Math.random() * maxX);
          const newY = Math.floor(Math.random() * maxY);
  
          button.style.left = `${newX}px`;
          button.style.top = `${newY}px`;
        });
        scrambleCount++;
      }
    }, 2000);
  }

  onGoButtonClick() {
    const numInput = document.getElementById("numInput");
    const value = parseInt(numInput.value, 10);
    if (value >= 3 && value <= 7) {
      this.createButtonsInRow(value);
      this.scrambleButtons(value);
    } else {
      this.showAlert();
    }
  }
}

document.getElementById("question").textContent = questionText;
document.getElementById("goButton").textContent = goButtonText;

// Initialize the Button class and add event listener to the 'goButton'
const buttonGenerate = new Button();
document.getElementById("goButton").addEventListener("click", () => {
  buttonGenerate.onGoButtonClick();
});
