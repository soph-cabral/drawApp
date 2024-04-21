let colorToMatch;
let tolerance = 5;

let video;

function setup() {
    createCanvas(windowWidth, windowHeight);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    colorToMatch = color(255, 0, 0);
}

function draw() {
    image(video, 0, 0);
    let firstPX = findColor(video, colorToMatch, tolerance);
    if (firstPX !== undefined){
        fill(colorToMatch);
        stroke(255); // Changed from strokeColor to stroke
        strokeWeight(2); // Changed from strokeWidth to strokeWeight
        ellipse(firstPX.x, firstPX.y, 30); // Changed from CSSNumericValue to ellipse
    }
}

function mousePressed() {
    loadPixels();
    colorToMatch = get(mouseX, mouseY);
}

function findColor(input, c, tolerance){
    input.loadPixels();
    for (let y = 0; y < input.height; y++){
        for (let x = 0; x < input.width; x++){
            let index = (y * input.width + x) * 4;
            let r = input.pixels[index];
            let g = input.pixels[index + 1];
            let b = input.pixels[index + 2];

            if (r >= red(c) - tolerance && r <= red(c) + tolerance &&
                g >= green(c) - tolerance && g <= green(c) + tolerance &&
                b >= blue(c) - tolerance && b <= blue(c) + tolerance){

                return createVector(x, y);
            }
        }
    }
}
