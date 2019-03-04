

function pixelate(img, { pixelation = 1, scaleFactor = 1 }) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = (img.width) * scaleFactor;
    const height = (img.height) * scaleFactor;
    canvas.width = width;
    canvas.height = height;
    const fw = (width / pixelation) | 0,
        fh = (height / pixelation) | 0;


    ctx.imageSmoothingEnabled =
        ctx.mozImageSmoothingEnabled =
        ctx.msImageSmoothingEnabled =
        ctx.webkitImageSmoothingEnabled = false;


    ctx.drawImage(img, 0, 0, fw, fh);

    ctx.drawImage(canvas, 0, 0, fw, fh, 0, 0, width, height);

    return transformData(ctx.getImageData(0, 0, width, height));

}

function transformData(imgData) {
    const output = [];
    const { width, height, data: pixels } = imgData;
    const size = width * height;
    for (let p = 0; p < size; p++) {
        const red = pixels[p * 4];
        const green = pixels[p * 4 + 1];
        const blue = pixels[p * 4 + 2];
        const alpha = pixels[p * 4 + 3];

        const y = parseInt(p / width, 10);
        const x = p - y * width;

        output.push({ x, y, color: `rgba(${red},${green},${blue},${alpha})` })
    }
    return { width, height, data: output };
}

export function getPixelData(src, pixelation) {

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;

        img.onload = function () {

            img.style.display = 'none';
            resolve(pixelate(img, pixelation));
        };
        img.onerror = (e) => {
            reject(e)
        }
    });

}