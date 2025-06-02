document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzleContainer');
    const solvedOverlay = document.getElementById('solvedOverlay');
    const imageSrc = 'https://img.upanh.tv/2025/06/02/f0b8cb70888295558883c2143e543cc6.jpg';
    const rows = 3;
    const cols = 3;
    const totalPieces = rows * cols;
    let pieces = [];
    let currentDraggingPiece = null;
    let isImageLoaded = false;

    // Preload image before creating puzzle
    function preloadImage() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                isImageLoaded = true;
                resolve();
            };
            img.onerror = () => {
                console.error('Failed to load puzzle image');
                reject(new Error('Failed to load puzzle image'));
            };
            img.src = imageSrc;
        });
    }

    // Create puzzle pieces
    function createPieces() {
        pieces = [];
        puzzleContainer.innerHTML = '';

        for (let i = 0; i < totalPieces; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.setAttribute('data-index', i);

            const row = Math.floor(i / cols);
            const col = i % cols;

            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.width = '300%';
            img.style.height = '300%';
            img.style.objectFit = 'cover';
            img.style.position = 'absolute';
            img.style.left = `${-col * 100}%`;
            img.style.top = `${-row * 100}%`;
            img.style.pointerEvents = 'none';

            piece.appendChild(img);
            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }
    }

    // Update piece positions
    function updatePiecePositions() {
        if (!puzzleContainer) return;
        
        const containerRect = puzzleContainer.getBoundingClientRect();
        const pieceWidth = containerRect.width / cols;
        const pieceHeight = containerRect.height / rows;

        pieces.forEach((piece, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            piece.style.position = 'absolute';
            piece.style.left = `${col * pieceWidth}px`;
            piece.style.top = `${row * pieceHeight}px`;
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
        });
    }

    // Shuffle pieces
    function shufflePieces(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        updatePiecePositions();
    }

    // Check win condition
    function checkWin() {
        for (let i = 0; i < totalPieces; i++) {
            if (pieces[i].getAttribute('data-index') != i) {
                return false;
            }
        }
        return true;
    }

    // Show solved overlay
    function showSolvedOverlay() {
        solvedOverlay.classList.add('visible');
        const closeButton = document.getElementById('closeOverlayButton');
        if (closeButton) {
            closeButton.addEventListener('click', hideSolvedOverlay);
        }
        startCelebration();
    }

    // Hide solved overlay
    function hideSolvedOverlay() {
        solvedOverlay.classList.remove('visible');
        const closeButton = document.getElementById('closeOverlayButton');
        if (closeButton) {
            closeButton.removeEventListener('click', hideSolvedOverlay);
        }
        stopCelebration();
    }

    let celebrationInterval = null;
    const celebrationElements = ['✨', '💖', ' confetti', '🎉', '🌸']; // Các biểu tượng/emoji chúc mừng

    // Tạo một phần tử chúc mừng rơi xuống
    function createCelebrationElement() {
        // Kiểm tra nếu là thiết bị di động
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Giảm số lượng phần tử trên mobile
        if (isMobile && Math.random() > 0.3) return;

        const element = document.createElement('div');
        element.classList.add('celebration-element');
        const emoji = celebrationElements[Math.floor(Math.random() * celebrationElements.length)];
        element.innerHTML = emoji.trim();

        if (emoji.trim() === 'confetti') {
            element.style.backgroundColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
            element.style.width = isMobile ? '5px' : '10px';
            element.style.height = isMobile ? '5px' : '10px';
            element.style.borderRadius = '50%';
            element.style.fontSize = '0.1em';
            element.innerHTML = '';
        }

        const startX = Math.random() * window.innerWidth;
        element.style.left = `${startX}px`;

        // Giảm thời gian animation trên mobile
        const duration = isMobile ? 
            Math.random() * 2 + 2 : // 2-4 giây trên mobile
            Math.random() * 3 + 3;  // 3-6 giây trên desktop
        element.style.animationDuration = `${duration}s`;
        
        const delay = Math.random() * 1;
        element.style.animationDelay = `-${delay}s`;
        element.style.opacity = '0';

        document.body.appendChild(element);

        element.addEventListener('animationend', () => {
            element.remove();
        });
    }

    // Bắt đầu tạo hiệu ứng chúc mừng
    function startCelebration() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Giảm số lượng phần tử ban đầu trên mobile
        const initialCount = isMobile ? 10 : 20;
        for(let i = 0; i < initialCount; i++) {
            createCelebrationElement();
        }
        
        // Tăng khoảng thời gian tạo phần tử mới trên mobile
        celebrationInterval = setInterval(createCelebrationElement, isMobile ? 200 : 100);
    }

    // Dừng tạo hiệu ứng chúc mừng và xóa các phần tử đang rơi
    function stopCelebration() {
        clearInterval(celebrationInterval);
        const elements = document.querySelectorAll('.celebration-element');
        elements.forEach(el => el.remove());
    }

    // Touch event handlers
    function onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        currentDraggingPiece = element.closest('.puzzle-piece');
        
        if (!currentDraggingPiece) return;

        currentDraggingPiece.classList.add('dragging');
        const rect = currentDraggingPiece.getBoundingClientRect();
        const containerRect = puzzleContainer.getBoundingClientRect();

        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        currentDraggingPiece.style.position = 'absolute';
        currentDraggingPiece.style.zIndex = '100';
    }

    function onTouchMove(e) {
        if (!currentDraggingPiece) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const containerRect = puzzleContainer.getBoundingClientRect();
        
        let newLeft = touch.clientX - containerRect.left - offsetX;
        let newTop = touch.clientY - containerRect.top - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - currentDraggingPiece.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - currentDraggingPiece.offsetHeight));

        currentDraggingPiece.style.left = `${newLeft}px`;
        currentDraggingPiece.style.top = `${newTop}px`;
    }

    function onTouchEnd(e) {
        if (!currentDraggingPiece) return;
        
        currentDraggingPiece.classList.remove('dragging');
        currentDraggingPiece.style.zIndex = '';
        snapPieceToGrid(currentDraggingPiece);
        currentDraggingPiece = null;

        if (checkWin()) {
            showSolvedOverlay();
        }
    }

    // Initialize game
    async function initializeGame() {
        try {
            await preloadImage();
            createPieces();
            shufflePieces(pieces);
            
            // Add touch event listeners
            puzzleContainer.addEventListener('touchstart', onTouchStart, { passive: false });
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
            document.addEventListener('touchcancel', onTouchEnd);

            // Add resize listener
            window.addEventListener('resize', updatePiecePositions);
            
            // Initial position update
            updatePiecePositions();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            puzzleContainer.innerHTML = '<p>Không thể tải trò chơi. Vui lòng thử lại sau.</p>';
        }
    }

    // Start the game
    initializeGame();
});
