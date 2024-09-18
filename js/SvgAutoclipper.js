document.addEventListener('DOMContentLoaded', () => {
  
  window.addEventListener('resize', () => {
    const images = document.querySelectorAll('img.SvgAutoclip');
    images.forEach(img => processImage(img));
  });
  
  // Function to fetch SVG, extract path data, and update stylesheet
  function processImage(img) {
    fetch(img.src)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // If the SVG also has a viewBox attribute, set the image's style to match
        const svg = svgDoc.querySelector('svg');
        const viewBox = svg.getAttribute('viewBox');
        console.log(viewBox);
        
        if (viewBox) {
          const viewBoxArray = viewBox.split(' ');
          img.style.width = `${viewBoxArray[2]}px`;
          img.style.height = `${viewBoxArray[3]}px`;
        }

        const path = svgDoc.querySelector('path');
        if (path) {
          const originalData = path.getAttribute('d');
          // Replace all occurances of consecutive whitespace characters with a single space
          let newPathData = originalData.replace(/\s+/g, ' ');
          // Replace commas with spaces
          newPathData = newPathData.replace(/,/g, ' ');

          // Update the stylesheet with the new path data
          updateStylesheet(img.id, newPathData);
        }
      })
      .catch(error => console.error('Error fetching SVG:', error));
  }

  // Function to update the stylesheet with the clip-path
  function updateStylesheet(id, pathData) {
    const styleSheet = document.styleSheets[0];
    const newRule = `#${id} { clip-path: path('${pathData}'); }`;
    styleSheet.insertRule(newRule, styleSheet.cssRules.length);
  }

  // Find all images with the "SvgAutoclip" class and process them
  const images = document.querySelectorAll('img.SvgAutoclip');
  images.forEach(img => processImage(img));
});