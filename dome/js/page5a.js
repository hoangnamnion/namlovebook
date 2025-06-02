const demoGalaxyData = {
    messages: [
        "CAO VĂN NAM",
        "Giá Làm 30.000",
        "bản Demo"
    ],
    icons: ["♥", "💖", "❤️", "💕", "💗", "💓", "💘", "💝", "💞", "💟"],
    colors: {
        love: "#ff6b9d",
        birthday: "#4ecdc4",
        date: "#ff69b4",
        special: "#ff6b9d",
        heart: "#ff69b4"
    },
    images: [
        "https://img.upanh.tv/2025/06/02/f0b8cb70888295558883c2143e543cc6.jpg",
        "https://img.upanh.tv/2025/06/02/cefa24b4a258bcf4c793282559c34a5e.jpg",
        "https://img.upanh.tv/2025/06/02/e0ab5cf1dfadd8ee7f8cd809bc9f1660.jpg",
        "https://img.upanh.tv/2025/06/02/a376a80c950684c503e2018956174027.jpg",
        "https://img.upanh.tv/2025/06/02/58722a647bd683aa72fd0c627005eabb.jpg",
        "https://img.upanh.tv/2025/06/02/82f0d47f73fc0d691def193fab4907d8.jpg",
        "https://img.upanh.tv/2025/06/02/6f29445307337679e22fc8f85d8abf17.jpg",
        "https://img.upanh.tv/2025/06/02/da2f1503a2a3fbc807f2272d41329eaf.jpg",
        "https://img.upanh.tv/2025/06/02/f0b8cb70888295558883c2143e543cc6.jpg",
        "https://img.upanh.tv/2025/06/02/e6250611b6f59c9c7b6d028ccc29342a.jpg"
    ],
    song: "./songs/love5.mp3",
    createdAt: new Date().toISOString()
};

const loadingScreen = document.getElementById('loadingScreen');
const errorScreen = document.getElementById('errorScreen');
const galaxy = document.getElementById('galaxy');

let galaxyData = null;
let rotationX = 0;
let rotationY = 0;
let scale = 1;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
const activeParticles = new Set();

// Responsive settings
const isMobile = window.innerWidth <= 768;
const isSmallMobile = window.innerWidth <= 480;
const maxParticles = isSmallMobile ? 150 : isMobile ? 200 : 300;
let particleInterval = isMobile ? 80 : 100;
const starCount = isSmallMobile ? 250 : isMobile ? 350 : 500;

let particleSpeedMultiplier = 1.3;

// Làm chậm khi ấn giữ chuột hoặc giữ tay trên màn hình
document.addEventListener('mousedown', () => {
    particleSpeedMultiplier = 1.7;
});
document.addEventListener('mouseup', () => {
    particleSpeedMultiplier = 1;
});
document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) particleSpeedMultiplier = 1.7;
});
document.addEventListener('touchend', () => {
    particleSpeedMultiplier = 1;
});

// Prevent scrolling and zooming
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
});

// Load galaxy data
function loadGalaxyData() {
    galaxyData = demoGalaxyData;
    initializeGalaxy();
}

function showError() {
    loadingScreen.style.display = 'none';
    errorScreen.style.display = 'flex';
}

function initializeGalaxy() {
    loadingScreen.style.display = 'none';
    
    // Apply custom colors to CSS
    const style = document.createElement('style');
    style.textContent = `
        .text-particle.love { color: ${galaxyData.colors.love}; text-shadow: 0 0 15px ${galaxyData.colors.love}, 0 0 25px ${galaxyData.colors.love}, 0 0 35px ${galaxyData.colors.love}, 2px 2px 6px rgba(0,0,0,0.9); }
        .text-particle.birthday { color: ${galaxyData.colors.birthday}; text-shadow: 0 0 15px ${galaxyData.colors.birthday}, 0 0 25px ${galaxyData.colors.birthday}, 0 0 35px ${galaxyData.colors.birthday}, 2px 2px 6px rgba(0,0,0,0.9); }
        .text-particle.date { color: ${galaxyData.colors.date}; text-shadow: 0 0 20px ${galaxyData.colors.date}, 0 0 30px ${galaxyData.colors.date}, 0 0 40px ${galaxyData.colors.date}, 2px 2px 6px rgba(0,0,0,0.9); }
        .text-particle.special { color: ${galaxyData.colors.special}; text-shadow: 0 0 15px ${galaxyData.colors.special}, 0 0 25px ${galaxyData.colors.special}, 0 0 35px ${galaxyData.colors.special}, 2px 2px 6px rgba(0,0,0,0.9); }
        .text-particle.heart { color: ${galaxyData.colors.heart}; text-shadow: 0 0 20px ${galaxyData.colors.heart}, 0 0 30px ${galaxyData.colors.heart}, 0 0 40px ${galaxyData.colors.heart}, 3px 3px 8px rgba(0,0,0,0.9); }
    `;
    document.head.appendChild(style);

    // Phát nhạc nếu có
    if (galaxyData.song) {
        const audio = document.getElementById('galaxyAudio');
        audio.src = galaxyData.song;
        audio.preload = 'auto';
        audio.muted = false;
        audio.volume = 1.0;
        
        audio.onerror = (e) => {
            console.error('Audio error:', e);
        };

        const playAudio = async () => {
            try {
                await audio.play();
            } catch (error) {
                console.log('Direct play failed, trying alternative methods...');
                try {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            audio.load();
                            audio.play().catch(console.error);
                        });
                    }
                } catch (e) {
                    console.error('All play attempts failed:', e);
                }
            }
        };

        const userInteractionEvents = ['click', 'touchstart', 'touchend', 'keydown'];
        userInteractionEvents.forEach(event => {
            document.addEventListener(event, playAudio, { once: true });
        });

        window.addEventListener('load', playAudio);
    }

    createStars();
    startParticleAnimation();
}

function getRandomMessage() {
    return galaxyData.messages[Math.floor(Math.random() * galaxyData.messages.length)];
}

function getRandomIcon() {
    return galaxyData.icons[Math.floor(Math.random() * galaxyData.icons.length)];
}

function getMessageClass(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("love") || lowerMessage.includes("yêu") || lowerMessage.includes("tình")) {
        return "love";
    } else if (lowerMessage.includes("birthday") || lowerMessage.includes("sinh nhật") || lowerMessage.includes("chúc mừng")) {
        return "birthday";
    } else if (/\d/.test(message) || message.includes("/")) {
        return "date";
    } else {
        return "special";
    }
}

function createTextParticle() {
    if (activeParticles.size >= maxParticles) {
        return;
    }

    const isIcon = Math.random() > 0.7;
    const element = document.createElement('div');
    
    if (isIcon) {
        element.className = 'text-particle heart';
        element.textContent = getRandomIcon();
    } else {
        const message = getRandomMessage();
        element.className = `text-particle ${getMessageClass(message)}`;
        element.textContent = message;
    }
    
    const xPos = Math.random() * 100;
    const zPos = (Math.random() - 0.5) * (isMobile ? 300 : 500);
    const animationDuration = Math.random() * 2 + (isMobile ? 3 : 3);
    
    element.style.left = xPos + '%';
    
    const baseFontSize = isSmallMobile ? 10 : isMobile ? 14 : 20;
    const fontSizeVariation = isSmallMobile ? 5 : isMobile ? 7 : 10;
    element.style.fontSize = (Math.random() * fontSizeVariation + baseFontSize) + 'px';
    
    const depthOpacity = Math.max(0.4, 1 - Math.abs(zPos) / (isMobile ? 250 : 400));
    element.style.opacity = depthOpacity;
    
    let startTime = null;
    let startY = -150;
    let endY = window.innerHeight + 150;
    const thisParticleSpeed = particleSpeedMultiplier;

    function animateParticle(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (animationDuration * 1000 * thisParticleSpeed);
        
        if (progress < 1) {
            const currentY = startY + (endY - startY) * progress;
            const opacity = progress < 0.05 ? progress * 20 : 
                          progress > 0.95 ? (1 - progress) * 20 : 
                          depthOpacity;
            
            element.style.transform = `translate3d(0, ${currentY}px, ${zPos}px)`;
            element.style.opacity = opacity;
            
            requestAnimationFrame(animateParticle);
        } else {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
                activeParticles.delete(element);
            }
        }
    }
    
    galaxy.appendChild(element);
    activeParticles.add(element);
    requestAnimationFrame(animateParticle);
}

function createStars() {
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const angle = Math.random() * Math.PI * 10;
        const radius = Math.random() * (isMobile ? 800 : 1500) + (isMobile ? 200 : 300);
        const spiralHeight = Math.sin(angle) * (isMobile ? 100 : 150);
        
        const x = Math.cos(angle) * radius;
        const y = spiralHeight + (Math.random() - 0.5) * (isMobile ? 1000 : 2000);
        const z = Math.sin(angle) * radius * 0.5;
        
        star.style.left = `calc(50% + ${x}px)`;
        star.style.top = `calc(50% + ${y}px)`;
        star.style.transform = `translateZ(${z}px)`;
        star.style.animationDelay = Math.random() * 3 + 's';
        
        const depthBrightness = Math.max(0.1, 1 - Math.abs(z) / (isMobile ? 800 : 1200));
        star.style.opacity = depthBrightness;
        
        galaxy.appendChild(star);
    }
}

function updateGalaxyTransform() {
    requestAnimationFrame(() => {
        galaxy.style.transform = `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`;
    });
}

function startParticleAnimation() {
    setInterval(() => {
        // 20% xác suất tạo ảnh, còn lại là icon/chữ
        if (galaxyData.images && galaxyData.images.length > 0 && Math.random() < 0.08) {
            createImageParticle();
        } else {
            createTextParticle();
        }
    }, particleInterval);

    const initialParticles = isMobile ? 30 : 25;
    for (let i = 0; i < initialParticles; i++) {
        setTimeout(() => {
            if (galaxyData.images && galaxyData.images.length > 0 && Math.random() < 0.08) {
                createImageParticle();
            } else {
                createTextParticle();
            }
        }, i * (particleInterval * 0.6));
    }
}

// Mouse events for desktop
document.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        const sensitivity = isMobile ? 0.3 : 0.5;
        rotationY += deltaX * sensitivity;
        rotationX -= deltaY * sensitivity;
        
        updateGalaxyTransform();
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Enhanced touch events for mobile
let initialDistance = 0;
let initialScale = 1;

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialScale = scale;
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - lastMouseX;
        const deltaY = e.touches[0].clientY - lastMouseY;
        
        const sensitivity = 0.3;
        rotationY += deltaX * sensitivity;
        rotationX -= deltaY * sensitivity;
        
        updateGalaxyTransform();
        
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const scaleChange = currentDistance / initialDistance;
        scale = Math.max(0.5, Math.min(2, initialScale * scaleChange));
        
        updateGalaxyTransform();
    }
}, { passive: false });

document.addEventListener('touchend', (e) => {
    e.preventDefault();
    isDragging = false;
}, { passive: false });

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        location.reload();
    }, 100);
});

function createImageParticle() {
    if (!galaxyData.images || galaxyData.images.length === 0 || activeParticles.size >= maxParticles) return;

    const img = document.createElement('img');
    img.src = galaxyData.images[Math.floor(Math.random() * galaxyData.images.length)];
    img.className = 'text-particle image-particle';
    img.style.width = (Math.random() * 50 + 80) + 'px';
    img.style.height = 'auto';
    img.style.borderRadius = '15px';
    img.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    img.style.background = '#fff';

    const xPos = Math.random() * 100;
    const zPos = (Math.random() - 0.5) * (isMobile ? 300 : 500);
    const animationDuration = Math.random() * 2 + (isMobile ? 3 : 3);

    img.style.left = xPos + '%';

    let startTime = null;
    let startY = -150;
    let endY = window.innerHeight + 150;
    const thisParticleSpeed = particleSpeedMultiplier;

    function animateParticle(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (animationDuration * 1000 * thisParticleSpeed);

        if (progress < 1) {
            const currentY = startY + (endY - startY) * progress;
            const opacity = progress < 0.05 ? progress * 20 :
                progress > 0.95 ? (1 - progress) * 20 :
                1;
            img.style.transform = `translate3d(0, ${currentY}px, ${zPos}px)`;
            img.style.opacity = opacity;

            requestAnimationFrame(animateParticle);
        } else {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
                activeParticles.delete(img);
            }
        }
    }

    galaxy.appendChild(img);
    activeParticles.add(img);
    requestAnimationFrame(animateParticle);
}

// Thêm hàm tính số ngày yêu nhau
function updateLoveDays() {
    // Thay đổi ngày bắt đầu yêu nhau ở đây (định dạng: YYYY-MM-DD)
    const startDate = new Date('2025-05-01'); // Ví dụ: 1/6/2024
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('loveDays').textContent = diffDays;
}

// Cập nhật số ngày mỗi giây để hiển thị realtime
updateLoveDays();
setInterval(updateLoveDays, 1000); // Cập nhật mỗi giây

// Initialize
loadGalaxyData(); 