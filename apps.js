// Load the click sound
const clickSound = new Audio('sounds/blip.wav');

// Find all buttons with the class "pixel-button"
const buttons = document.querySelectorAll('.pixel-button');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    clickSound.currentTime = 0; // Rewind to start
    clickSound.play();
  });
});


