document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let flags = 0;
    let bombAmount = 20;
    let squares: HTMLDivElement[] = [];
    let isGameOver = false;

    function createBoard() {
        // Get shuffled game array with random bombs.
        const bombsArray = Array<string>(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < width * width; i++){
            const square = document.createElement('div');
            square.setAttribute('id', i.toString());
            square.classList.add(shuffledArray[i]);
            grid!.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e) {
                clickSquare(square);
            });

            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }
        
        // Add numbers.
        for (let i = 0; i < squares.length; i++) {
            let total = 0;

            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === 9;
            const isTopEdge = i < 10;
            const isBottomEdge = i >= 90;

            if (squares[i].classList.contains('valid')) {
                if (!isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                if (!isLeftEdge && !isTopEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                if (!isTopEdge && squares[i - width].classList.contains('bomb')) total++;
                if (!isTopEdge && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                if (!isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                if (!isRightEdge && !isBottomEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                if (!isBottomEdge && squares[i + width].classList.contains('bomb')) total++;
                if (!isBottomEdge && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total.toString());
            }
        }
    }

    createBoard();

    function addFlag(square: HTMLDivElement) {
        if (isGameOver) return;
        if (square.classList.contains('checked') || flags >= bombAmount) return;

        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
            flags++;
            checkForWin();
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
        }
    }

    function clickSquare(square: HTMLElement) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            gameOver(square);
            return;
        }
        const total = Number(square.getAttribute('data'));
        square.classList.add('checked');
        if (total > 0) {
            square.innerHTML = total.toString();
        } else {
            checkSquare(square, +currentId);
        }
    }

    function checkSquare(square: HTMLElement, currentId: number) {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;

        setTimeout(() => {
            const isLeftEdge = currentId % width === 0;
            const isRightEdge = currentId % width === 9;
            const isTopEdge = currentId < 10;
            const isBottomEdge = currentId >= 90;

            if (!isLeftEdge) {
                const newId = squares[currentId - 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isLeftEdge && !isTopEdge) {
                const newId = squares[currentId - 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isTopEdge) {
                const newId = squares[currentId - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isTopEdge && !isRightEdge) {
                const newId = squares[currentId + 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isRightEdge) {
                const newId = squares[currentId + 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isRightEdge && !isBottomEdge) {
                const newId = squares[currentId + 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isBottomEdge) {
                const newId = squares[currentId + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isBottomEdge && !isLeftEdge) {
                const newId = squares[currentId - 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
        }, 10);
    }

    function gameOver(square: HTMLElement) {
        alert('BOOM! Game over!');
        isGameOver = true;

        // Show all the bombs.
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        });
    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                alert('YOU WIN!');
                isGameOver = true;
                return;
            }
        }
    }
});