const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const doritoTemplate = new Image();
doritoTemplate.src = "https://dorito-glasses-maker.netlify.app/DoritoGlasses.png";
doritoTemplate.crossOrigin = "anonymous";

const goldDustImage = new Image();
goldDustImage.src = "https://dorito-glasses-maker.netlify.app/GoldDust.png";
goldDustImage.crossOrigin = "anonymous";

const glitterImage = new Image();
goldDustImage.src = "https://dorito-glasses-maker.netlify.app/Glitter.png";
goldDustImage.crossOrigin = "anonymous";


let canvasImage = new Image();
let glasses = [];
let isDragging = false;
let currentGlasses = null;
let offsetX, offsetY;
const MAX_WIDTH = 640;
const MAX_HEIGHT = 480;

let originalImageWidth, originalImageHeight;
let currentFilter = 'classic';

window.addEventListener('DOMContentLoaded', () => {
  // Set resize slider to the middle
  const resizeSlider = document.getElementById('resize-slider');
  resizeSlider.value = '1.25';  // Middle value between 0.5 and 2

  // Set rotate slider to the middle
  const rotateSlider = document.getElementById('rotate-slider');
  rotateSlider.value = '0';  // Middle value between 0 and 360
});

document.getElementById("image-upload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    document.getElementById("h1-title").style.display = "none";
    canvasImage.onload = function () {
      originalImageWidth = canvasImage.width;
      originalImageHeight = canvasImage.height;

      // Scale the image to fit within the specified limits
      const scale = Math.min(
        MAX_WIDTH / canvasImage.width,
        MAX_HEIGHT / canvasImage.height,
        1
      );
      canvas.width = canvasImage.width * scale;
      canvas.height = canvasImage.height * scale;
      drawCanvas();
      document.querySelector(".button-container").style.display = "flex";
    };
    canvasImage.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("add-dorito-button").addEventListener("click", function () {
  const aspectRatio = doritoTemplate.width / doritoTemplate.height;
  
  let doritoWidth = (canvas.width / 5) * 3; // Double the size
  let doritoHeight = doritoWidth / aspectRatio; // Adjust height based on aspect ratio

  if (doritoHeight > canvas.height) {
    doritoHeight = (canvas.height / 5) * 3;
    doritoWidth = doritoHeight * aspectRatio;
  }
  
  const dorito = {
    image: doritoTemplate,
    width: doritoWidth,
    height: doritoHeight,
    x: canvas.width / 2 - doritoWidth / 2,
    y: canvas.height / 2 - doritoHeight / 2,
    rotation: 0,
  };
  glasses.push(dorito);
  drawCanvas();
});

document.getElementById("resize-slider").addEventListener("input", function (e) {
  const scale = e.target.value;
  glasses.forEach((dorito) => {
    const aspectRatio = dorito.image.width / dorito.image.height;
    const centerX = dorito.x + dorito.width / 2;
    const centerY = dorito.y + dorito.height / 2;

    dorito.width = (canvas.width / 5) * scale * 2;
    dorito.height = dorito.width / aspectRatio;

    dorito.x = centerX - dorito.width / 2;
    dorito.y = centerY - dorito.height / 2;
  });
  drawCanvas();
});

document.getElementById("rotate-slider").addEventListener("input", function (e) {
  const rotation = (e.target.value * Math.PI) / 180;
  glasses.forEach((dorito) => {
    dorito.rotation = rotation;
  });
  drawCanvas();
});

document.querySelectorAll('.filter-option').forEach(option => {
  option.addEventListener('click', function () {
    document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
    currentFilter = this.getAttribute('data-filter');
    drawCanvas();
  });
});

canvas.addEventListener("mousedown", function (e) {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  currentGlasses = null;
  let closestDistance = Infinity;

  glasses.forEach((dorito) => {
    const centerX = dorito.x + dorito.width / 2;
    const centerY = dorito.y + dorito.height / 2;
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );

    if (
      mouseX > dorito.x &&
      mouseX < dorito.x + dorito.width &&
      mouseY > dorito.y &&
      mouseY < dorito.y + dorito.height &&
      distance < closestDistance
    ) {
      dorito.isDragging = true;
      offsetX = mouseX - dorito.x;
      offsetY = mouseY - dorito.y;
      currentGlasses = dorito;
      closestDistance = distance;
    }
  });

  if (currentGlasses) {
    isDragging = true;
  }
});

canvas.addEventListener("mousemove", function (e) {
  if (isDragging && currentGlasses) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    currentGlasses.x = mouseX - offsetX;
    currentGlasses.y = mouseY - offsetY;
    drawCanvas();
  }
});

canvas.addEventListener("mouseup", function () {
  if (currentGlasses) {
    currentGlasses.isDragging = false;
    isDragging = false;
    currentGlasses = null;
  }
});

// Add touch event listeners
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouseX = (touch.clientX - rect.left) * scaleX;
  const mouseY = (touch.clientY - rect.top) * scaleY;
  currentGlasses = null;
  let closestDistance = Infinity;

  glasses.forEach((dorito) => {
    const centerX = dorito.x + dorito.width / 2;
    const centerY = dorito.y + dorito.height / 2;
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );

    if (
      mouseX > dorito.x &&
      mouseX < dorito.x + dorito.width &&
      mouseY > dorito.y &&
      mouseY < dorito.y + dorito.height &&
      distance < closestDistance
    ) {
      dorito.isDragging = true;
      offsetX = mouseX - dorito.x;
      offsetY = mouseY - dorito.y;
      currentGlasses = dorito;
      closestDistance = distance;
    }
  });

  if (currentGlasses) {
    isDragging = true;
  }
});

canvas.addEventListener("touchmove", function (e) {
  if (isDragging && currentGlasses) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (touch.clientX - rect.left) * scaleX;
    const mouseY = (touch.clientY - rect.top) * scaleY;
    currentGlasses.x = mouseX - offsetX;
    currentGlasses.y = mouseY - offsetY;
    drawCanvas();
  }
});

canvas.addEventListener("touchend", function () {
  if (currentGlasses) {
    currentGlasses.isDragging = false;
    isDragging = false;
    currentGlasses = null;
  }
});

document.getElementById("download-button").addEventListener("click", function () {
  const fullResCanvas = document.createElement("canvas");
  fullResCanvas.width = originalImageWidth;
  fullResCanvas.height = originalImageHeight;
  const fullResCtx = fullResCanvas.getContext("2d", { willReadFrequently: true });

  // Draw the original image at full resolution
  fullResCtx.drawImage(canvasImage, 0, 0, fullResCanvas.width, fullResCanvas.height);

  // Apply the gradient map filter to the full resolution canvas
  applyFullResGradientMapFilter(fullResCtx, fullResCanvas.width, fullResCanvas.height);

  const scaleX = fullResCanvas.width / canvas.width;
  const scaleY = fullResCanvas.height / canvas.height;

  glasses.forEach((dorito) => {
    fullResCtx.save();
    fullResCtx.translate(
      dorito.x * scaleX + (dorito.width * scaleX) / 2,
      dorito.y * scaleY + (dorito.height * scaleY) / 2
    );
    fullResCtx.rotate(dorito.rotation);
    fullResCtx.drawImage(
      dorito.image,
      -(dorito.width * scaleX) / 2,
      -(dorito.height * scaleY) / 2,
      dorito.width * scaleX,
      dorito.height * scaleY
    );
    fullResCtx.restore();
  });

  fullResCanvas.toBlob(function (blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dark_pfp_full_res.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 'image/png');
});

window.addEventListener("paste", function (e) {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const file = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById("h1-title").style.display = "none";
        canvasImage.onload = function () {
          originalImageWidth = canvasImage.width;
          originalImageHeight = canvasImage.height;

          const scale = Math.min(
            MAX_WIDTH / canvasImage.width,
            MAX_HEIGHT / canvasImage.height,
            1
          );
          canvas.width = canvasImage.width * scale;
          canvas.height = canvasImage.height * scale;
          drawCanvas();
          document.querySelector(".button-container").style.display = "flex";
        };
        canvasImage.src = event.target.result;
      };
      reader.readAsDataURL(file);
      break;  // Exit loop after processing first image item
    }
  }
});

canvas.addEventListener("dragover", function (e) {
  e.preventDefault();  // Prevent default to allow drop
});

canvas.addEventListener("drop", function (e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.indexOf("image") !== -1) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("h1-title").style.display = "none";
      canvasImage.onload = function () {
        originalImageWidth = canvasImage.width;
        originalImageHeight = canvasImage.height;

        const scale = Math.min(
          MAX_WIDTH / canvasImage.width,
          MAX_HEIGHT / canvasImage.height,
          1
        );
        canvas.width = canvasImage.width * scale;
        canvas.height = canvasImage.height * scale;
        drawCanvas();
        document.querySelector(".button-container").style.display = "flex";
      };
      canvasImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});


function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
  ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);

  if (currentFilter === 'dark') {
    applyGradientMapFilter(ctx, canvas.width, canvas.height);
  } else if (currentFilter === 'classic') {
    applyGoldDustFilter(ctx, canvas.width, canvas.height);
  } else if (currentFilter === 'light') {
    applyLightFilter(ctx, canvas.width, canvas.height);
  }

  glasses.forEach((dorito) => {
    ctx.save();
    ctx.translate(dorito.x + dorito.width / 2, dorito.y + dorito.height / 2);
    ctx.rotate(dorito.rotation);
    ctx.drawImage(
      dorito.image,
      -dorito.width / 2,
      -dorito.height / 2,
      dorito.width,
      dorito.height
    );
    ctx.restore();
  });
}

function applyGradientMapFilter(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  const redColor = [243, 4, 13]; // #f3040d
  const blueColor = [7, 11, 40]; // #070b28

  // Apply gradient map
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

    const factor = brightness / 255;
    const adjustedFactor = Math.pow(factor, 0.9);

    data[i] = blueColor[0] + adjustedFactor * (redColor[0] - blueColor[0]);
    data[i + 1] =
      blueColor[1] + adjustedFactor * (redColor[1] - blueColor[1]);
    data[i + 2] =
      blueColor[2] + adjustedFactor * (redColor[2] - blueColor[2]);
  }

  context.putImageData(imageData, 0, 0);
}

function applyGoldDustFilter(context, width, height) {
  if (goldDustImage.complete) {  // Ensure the image is fully loaded
    context.globalAlpha = 0.8;  // Adjust the transparency as needed
    context.drawImage(goldDustImage, 0, 0, width, height);
    context.drawImage(glitterImage, 0, 0, width, height);
    context.globalAlpha = 1.0;  // Reset the alpha for subsequent operations
  } else {
    goldDustImage.onload = () => {
      context.globalAlpha = 0.8;
      context.drawImage(goldDustImage, 0, 0, width, height);
      context.drawImage(glitterImage, 0, 0, width, height);
      context.globalAlpha = 1.0;
    };
  }
}


function applyLightFilter(context, width, height) {
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Adjust these values to fine-tune the effect
  const redFlareStrength = 0.4;   // Strength of the red flare (0-1)
  const blueHintStrength = 0.1;   // Strength of the blue hints (0-1)
  const saturationBoost = 1.2;    // Increase overall color saturation
  const contrastBoost = 1.1;      // Slight increase in contrast

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply contrast boost
    r = Math.min(255, Math.max(0, (r - 128) * contrastBoost + 128));
    g = Math.min(255, Math.max(0, (g - 128) * contrastBoost + 128));
    b = Math.min(255, Math.max(0, (b - 128) * contrastBoost + 128));

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Apply red flare
    r = Math.min(255, r + (255 - r) * redFlareStrength);
    
    // Apply subtle blue hints to darker areas
    const blueFactor = Math.pow(1 - luminance / 255, 2) * blueHintStrength;
    b = Math.min(255, b + (255 - b) * blueFactor);

    // Boost saturation
    const avg = (r + g + b) / 3;
    r = Math.min(255, avg + (r - avg) * saturationBoost);
    g = Math.min(255, avg + (g - avg) * saturationBoost);
    b = Math.min(255, avg + (b - avg) * saturationBoost);

    // Set the new pixel values
    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }

  context.putImageData(imageData, 0, 0);
}

function applyFullResGradientMapFilter(context, width, height) {
  if (currentFilter === 'dark') {
    applyGradientMapFilter(context, width, height);
  } else if (currentFilter === 'classic') {
    applyGoldDustFilter(context, width, height);
  } else if (currentFilter === 'light') {
    applyLightFilter(context, width, height);
  }
}
