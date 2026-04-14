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
    const shutterSound = document.getElementById('shutterSound');
    let currentLine = 0;

    overlay.addEventListener('click', () => {
        // Play camera shutter sound
        shutterSound.currentTime = 0;
        shutterSound.play();

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
    setupMouseTracking();
});

window.addEventListener('resize', generateRandomCutouts);

function setupMouseTracking() {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update active poem line with character-level wrapping
        const activeLine = document.querySelector('.poem-line.active');
        if (activeLine) {
            // Create spans for each character if not already done
            if (!activeLine.classList.contains('char-wrapped')) {
                const originalHTML = activeLine.innerHTML;
                let newHTML = '';
                let i = 0;
                while (i < originalHTML.length) {
                    // Check if we're at the start of an HTML tag
                    if (originalHTML[i] === '<') {
                        const endTag = originalHTML.indexOf('>', i);
                        newHTML += originalHTML.substring(i, endTag + 1);
                        i = endTag + 1;
                    } else if (originalHTML[i] === ' ') {
                        newHTML += ' ';
                        i++;
                    } else {
                        newHTML += `<span class="char">${originalHTML[i]}</span>`;
                        i++;
                    }
                }
                activeLine.innerHTML = newHTML;
                activeLine.classList.add('char-wrapped');
            }
            
            // Update each character's position
            const chars = activeLine.querySelectorAll('.char');
            chars.forEach(char => {
                const charRect = char.getBoundingClientRect();
                const charX = charRect.left + charRect.width / 2;
                const charY = charRect.top + charRect.height / 2;
                
                const distX = mouseX - charX;
                const distY = mouseY - charY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                // If mouse is close to character, apply repel effect
                if (distance < 150) {
                    const angle = Math.atan2(distY, distX);
                    const pushDistance = Math.max(0, 150 - distance) * 0.3;
                    const pushX = Math.cos(angle) * pushDistance;
                    const pushY = Math.sin(angle) * pushDistance;
                    
                    char.style.transform = `translate(${pushX}px, ${pushY}px)`;
                } else {
                    char.style.transform = 'translate(0, 0)';
                }
            });
        }
    });
}
