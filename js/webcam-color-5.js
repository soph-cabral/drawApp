let colorToMatch;
let tolerance = 5;
let brushSize = 20;

let video;
let paintCanvas;

function setup() {
    // Create the paint canvas inside the canvas-container
    let canvasContainer = select('#canvas-container');
    let canvasWidth = canvasContainer.width;
    let canvasHeight = canvasContainer.height;

    // Create the paint canvas
    paintCanvas = createGraphics(canvasWidth, canvasHeight);
    paintCanvas.parent(canvasContainer);

    // Apply styles to the paint canvas
    paintCanvas.style('flex-grow', '1');
    paintCanvas.style('display', 'flex');
    paintCanvas.style('justify-content', 'center');
    paintCanvas.style('align-items', 'center');
    paintCanvas.style('height', '100%');

    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices);

    createCanvas(windowWidth, windowHeight);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    colorToMatch = color(255, 0, 0);
}

const devices = [];

function draw() {
    image(video, 0, 0);
    //image(paintCanvas, video.width, 0, video.width, video.height);

    let firstPX = findColor(video, colorToMatch, tolerance);

    if (firstPX !== undefined) {
        let mappedX = map(firstPX.x, 0, video.width, 0, paintCanvas.width);
        let mappedY = map(firstPX.y, 0, video.height, 0, paintCanvas.height);

        paintCanvas.noStroke();
        paintCanvas.fill(colorToMatch);
        
        let isReddish = isReddishColor(colorToMatch);
        let isGreenish = isGreenishColor(colorToMatch);
        
        if (isReddish) {
            // Draw red flower
            for (let i = 0; i < 10; i++) {
                paintCanvas.normalMaterial();
                paintCanvas.sphere(50);

            }
        } else if (isGreenish) {
            // Draw green flower
            for (let i = 0; i < 10; i++) {
                paintCanvas.ellipse(mappedX, mappedY, 20, 80);
                paintCanvas.rotate(PI/5);
            }
        } else {
            // Draw regular ellipse if color is neither reddish nor greenish
            paintCanvas.normalMaterial();
            paintCanvas.sphere(50);
        }
        
        // Reset rotation
        paintCanvas.resetMatrix();
    }
}


function mousePressed() {
    if (mouseX < video.width && mouseY < video.height) {
        let selectedColor = video.get(mouseX, mouseY);
        colorToMatch = selectedColor;
    }
}

function findColor(input, c, tolerance) {
    input.loadPixels();
    for (let y = 0; y < input.height; y++) {
        for (let x = 0; x < input.width; x++) {
            let index = (y * input.width + x) * 4;
            let r = input.pixels[index];
            let g = input.pixels[index + 1];
            let b = input.pixels[index + 2];

            if (r >= red(c) - tolerance && r <= red(c) + tolerance &&
                g >= green(c) - tolerance && g <= green(c) + tolerance &&
                b >= blue(c) - tolerance && b <= blue(c) + tolerance) {
                return createVector(x, y);
            }
        }
    }
}

function gotDevices(deviceInfos) {
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        if (deviceInfo.kind == 'videoinput') {
            devices.push({
                label: deviceInfo.label,
                id: deviceInfo.deviceId
            });
        }
    }

    let constraints = {
        video: {
            deviceId: {
                exact: devices[0].id
            }
        }
    };

    video = createCapture(constraints);
    video.size(640, 480);
    video.hide();
}

function isReddishColor(c) {
    // Define the threshold for reddish color
    let minRed = 100;
    let maxGreen = 50;
    let maxBlue = 50;

    // Extract RGB components of the color
    let r = red(c);
    let g = green(c);
    let b = blue(c);

    // Check if the color is reddish
    if (r >= minRed && g <= maxGreen && b <= maxBlue) {
        return true;
    } else {
        return false;
    }
}

function isGreenishColor(c) {
    // Define the threshold for reddish color
    let minRed = 50;
    let maxGreen = 100;
    let maxBlue = 50;

    // Extract RGB components of the color
    let r = red(c);
    let g = green(c);
    let b = blue(c);

    // Check if the color is reddish
    if (r >= minRed && g <= maxGreen && b <= maxBlue) {
        return true;
    } else {
        return false;
    }
}