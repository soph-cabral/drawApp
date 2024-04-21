let colorToMatch;
let tolerance = 5;
let brushSize = 20;

let video;
let paintCanvas;

function setup() {
    navigator.mediaDevices.enumerateDevices()
    .then(gotDevices);

    createCanvas(windowWidth, windowHeight);

    // Create the paint canvas, make it responsive to the screen size
    paintCanvas = createGraphics(640, 480);
    
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    colorToMatch = color(255, 0, 0);
}

const devices = [];

function draw() {
    image(video, 0, 0);

    // Draw the paint canvas next to the webcam feed
    image(paintCanvas, 0, 0);

    // Find the position of the color to match in the webcam feed
    let firstPX = findColor(video, colorToMatch, tolerance);

    if (firstPX !== undefined) {
        // Map the position of the color to the paint canvas
        let mappedX = map(firstPX.x, 0, video.width, 0, paintCanvas.width);
        let mappedY = map(firstPX.y, 0, video.height, 0, paintCanvas.height);

        // Draw the color on the paint canvas
        paintCanvas.noStroke();
        paintCanvas.fill(colorToMatch);
        paintCanvas.ellipse(mappedX, mappedY, brushSize, brushSize);
    }
}

function mousePressed() {
    // When mouse is pressed on the webcam feed, pick the color from that point
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


// camera
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

    // Assign the capture to the global video variable
    video = createCapture(constraints);
    video.size(640, 480);
    video.hide();
}