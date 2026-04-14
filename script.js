function generateRandomCutouts() {
    const canvas = document.querySelector('.cutout-canvas');
    const activeImg = document.querySelector('.bg-img.active');

    const numCircles = 8;
    const circles = [];

    for (let i = 0; i < numCircles; i++) {
        circles.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            r: Math.random() * 6 + 2
        });
    }

    // Get the other (non-active) image as the source for cutout circles
    const imgs = document.querySelectorAll('.bg-img');
    const sourceImg = imgs[0].classList.contains('active') ? imgs[1] : imgs[0];

    function draw() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        circles.forEach((circle) => {
            const cx = (circle.x / 100) * width;
            const cy = (circle.y / 100) * height;
            const cr = (circle.r / 100) * width;

            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, cr, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(sourceImg, 0, 0, width, height);
            ctx.restore();
        });
    }

    if (sourceImg.complete) {
        draw();
    } else {
        sourceImg.onload = draw;
    }
}

function setupPoemOverlay() {
    const overlay = document.getElementById('poem-overlay');
    const lines = document.querySelectorAll('.poem-line');
    const imgs = document.querySelectorAll('.bg-img');
    let currentLine = 0;

    overlay.addEventListener('click', () => {
        lines[currentLine].classList.remove('active');
        currentLine = (currentLine + 1) % lines.length;
        lines[currentLine].classList.add('active');

        // When looping back to first line, swap the background image
        if (currentLine === 0) {
            imgs.forEach(img => img.classList.toggle('active'));
        }

        generateRandomCutouts();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    generateRandomCutouts();
    setupPoemOverlay();
});

window.addEventListener('resize', generateRandomCutouts);
