
  let x = 0, y = 0;
  let angle = 0;
  let startAngle = 0;
  let isShiftKeyPressed = false;
  let isRotating = false;

  const image = document.getElementById('image1');

  // Helper function to calculate the angle between the center of the image and the mouse position
  function calculateAngle(mouseX, mouseY, rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
  }

  // Initialize Interact.js for dragging (left-click without Shift)
  interact(image)
    .draggable({
      listeners: {
        move(event) {
          if (!isShiftKeyPressed && event.buttons !== 2) { // Only drag with left-click (without Shift key)
            x += event.dx;
            y += event.dy;
            event.target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
          }
        }
      }
    })
    .gesturable({
      listeners: {
        move(event) {
          angle += event.da;  // da is the rotation delta from the gesture
          event.target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
        }
      }
    });

  // Mouse down event to detect Shift + left-click or right-click for rotation gesture
  image.addEventListener('mousedown', function(e) {
    if (e.button === 0 && isShiftKeyPressed) { // Shift + Left-click for rotation
      const rect = image.getBoundingClientRect();
      startAngle = calculateAngle(e.clientX, e.clientY, rect) - angle;
      isRotating = true;

      document.addEventListener('mousemove', rotateWithMouse);
      document.addEventListener('mouseup', endRotation);
    } else if (e.button === 2) { // Right-click for rotation
      const rect = image.getBoundingClientRect();
      startAngle = calculateAngle(e.clientX, e.clientY, rect) - angle;
      isRotating = true;

      document.addEventListener('mousemove', rotateWithMouse);
      document.addEventListener('mouseup', endRotation);
    }
  });

  // Mouse move event to calculate and apply rotation
  function rotateWithMouse(e) {
    if (isRotating) {
      const rect = image.getBoundingClientRect();
      const currentAngle = calculateAngle(e.clientX, e.clientY, rect);
      angle = currentAngle - startAngle;
      image.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
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

  // Prevent the default context menu when right-clicking
  window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
