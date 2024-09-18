let transformations = new Map(); // Store transformation data per image
let currentImage = null;
let isShiftKeyPressed = false;
let isRotating = false;
let startAngle = 0;
let isDragging=false;

document.addEventListener('mouseover', function(event) {
  let hoveredElement = event.target;
  if (hoveredElement.tagName === 'IMG' && !isDragging && !isRotating) { // Targeting images
    if (currentImage) {
      // Remove existing interact.js setup for the previous image
      interact(currentImage).unset();
    }
    
    currentImage = hoveredElement;
    console.log('Hovered element ID:', currentImage.id);

    // Check if the current image has existing transformation values
    if (!transformations.has(currentImage)) {
      transformations.set(currentImage, { x: 0, y: 0, angle: 0 });
    }

    // Retrieve the current image's transformation values
    let { x, y, angle } = transformations.get(currentImage);

    // Initialize Interact.js for the current image
    interact(currentImage)
      .draggable({
        listeners: {
          start(){
            isDragging = true;
          },
          move(event) {
            let { x, y, angle } = transformations.get(currentImage);
            if (!isShiftKeyPressed && event.buttons === 1) { // Drag with left-click (without Shift key)
              x += event.dx;
              y += event.dy;
              event.target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
              // Save the updated transformation values
              transformations.set(currentImage, { x, y, angle });
            }
          },
            end(){
              isDragging=false;
            }
        }
      })
      .gesturable({
        listeners: {
          move(event) {
            let { x, y, angle } = transformations.get(currentImage);
            if (event.delta && event.delta.rotation) { // Ensure the delta object has rotation
              angle += event.da; // da is the rotation delta from the gesture
              event.target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
              // Save the updated transformation values
              transformations.set(currentImage, { x, y, angle });
            }
          }
        }
      });

    // Add event listener for mouse down events for rotation
    currentImage.addEventListener('mousedown', function(e) {
      let { x, y, angle } = transformations.get(currentImage); // Retrieve the angle from transformations
      if ((e.button === 0 && isShiftKeyPressed) || e.button === 2) { // Shift + Left-click or Right-click for rotation
        const rect = currentImage.getBoundingClientRect();
        startAngle = calculateAngle(e.clientX, e.clientY, rect) - angle; // Use the stored angle
        isRotating = true;

        document.addEventListener('mousemove', rotateWithMouse);
        document.addEventListener('mouseup', endRotation);
      }
    });
  }
});

// Helper function to calculate the angle between the center of the image and the mouse position
function calculateAngle(mouseX, mouseY, rect) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
}

// Mouse move event to calculate and apply rotation
function rotateWithMouse(e) {
  if (isRotating && currentImage) {
    const { x, y, angle } = transformations.get(currentImage);
    const rect = currentImage.getBoundingClientRect();
    const currentAngle = calculateAngle(e.clientX, e.clientY, rect);
    let newAngle = currentAngle - startAngle;
    currentImage.style.transform = `translate(${x}px, ${y}px) rotate(${newAngle}deg)`;
    // Save the updated transformation values
    transformations.set(currentImage, { x, y, angle: newAngle });
  }
}

// Mouse up event to stop the rotation gesture
function endRotation() {
  isRotating = false;
  document.removeEventListener('mousemove', rotateWithMouse);
  document.removeEventListener('mouseup', endRotation);
}

// Detect when the Shift key is pressed to enable rotation with left-click
window.addEventListener('keydown', function(e) {
  if (e.key === 'Shift') {
    isShiftKeyPressed = true;
  }
});

// Detect when the Shift key is released
window.addEventListener('keyup', function(e) {
  if (e.key === 'Shift') {
    isShiftKeyPressed = false;
  }
});

// Prevent the default context menu when right-clicking on images
document.addEventListener('contextmenu', function(e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// Resize Images based on screen size
function resizeImages() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Define a base percentage of the screen size for the image size
  const widthPercentage = 0.1;  // 10% of screen width
  const heightPercentage = 0.1; // 10% of screen height
  
  const images = document.querySelectorAll('img.SvgAutoclip');
  images.forEach(img => {
    // Set width and height as a percentage of screen size
    img.style.width = `${screenWidth * widthPercentage}px`;
    img.style.height = `${screenHeight * heightPercentage}px`;
  });
}

// Call the resizeImages function when the page loads
window.addEventListener('load', resizeImages);

// Call the resizeImages function when the window is resized
window.addEventListener('resize', resizeImages);