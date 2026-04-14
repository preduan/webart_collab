function generateRandomCutouts() {
    const imageContainers = document.querySelectorAll('.image-container');
    
    // Generate one set of random circles that will be used for all images
    const numCircles = 8;
    const circles = [];
    
    for (let i = 0; i < numCircles; i++) {
        circles.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            r: Math.random() * 6 + 2
        });
    }
    
    // Apply circles to each canvas
    imageContainers.forEach((container, index) => {
        const img = container.querySelector('img');
        const canvas = container.querySelector('.cutout-canvas');
        
        // Determine which image to use for the cutouts
        let sourceImg = img;
        if (index === 0) {
            // Bird uses pool circles
            sourceImg = imageContainers[2].querySelector('img');
        } else if (index === 1) {
            // Cat uses red circles
            sourceImg = imageContainers[3].querySelector('img');
        } else if (index === 2) {
            // Pool uses bird circles
            sourceImg = imageContainers[0].querySelector('img');
        } else if (index === 3) {
            // Red uses cat circles
            sourceImg = imageContainers[1].querySelector('img');
        }
        
        // Wait for image to load to get actual dimensions
        if (sourceImg.complete) {
            drawCircles(canvas, sourceImg, circles);
        } else {
            sourceImg.onload = () => {
                drawCircles(canvas, sourceImg, circles);
            };
        }
    });
}

function drawCircles(canvas, img, circles) {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    
    // Draw circles with image content
    circles.forEach((circle) => {
        const circleX = (circle.x / 100) * width;
        const circleY = (circle.y / 100) * height;
        const circleRadius = (circle.r / 100) * width;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
        ctx.clip();
        
        ctx.drawImage(img, 0, 0, width, height);
        
        ctx.restore();
    });
}

// Generate cutouts when page loads
document.addEventListener('DOMContentLoaded', generateRandomCutouts);

// Also regenerate on window resize to maintain accuracy
window.addEventListener('resize', generateRandomCutouts);

