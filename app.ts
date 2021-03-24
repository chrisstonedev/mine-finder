document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const restart = document.querySelector('.restart');
    let width = 10;
    let height = 10;
    let flags = 0;
    let mineAmount = 20;
    let squares: HTMLDivElement[] = [];
    let isGameOver = false;

    function createBoard() {
        flagsLeft!.innerHTML = mineAmount.toString();

        // Get shuffled game array with random mines.
        const minesArray = Array(mineAmount).fill('mine');
        const emptyArray = Array(width * height - mineAmount).fill('valid');
        const gameArray = emptyArray.concat(minesArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * height; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i.toString());
            square.classList.add(shuffledArray[i]);
            grid!.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e) {
                userClickedSquare(square);
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
        const isRightEdge = i % width === width -1;
        const isTopEdge = i < width;
        const isBottomEdge = i >= width * height - width;

        if (squares[i].classList.contains('valid')) {
            if (!isLeftEdge && squares[i - 1].classList.contains('mine')) total++;
            if (!isLeftEdge && !isTopEdge && squares[i - 1 - width].classList.contains('mine')) total++;
            if (!isTopEdge && squares[i - width].classList.contains('mine')) total++;
            if (!isTopEdge && !isRightEdge && squares[i + 1 - width].classList.contains('mine')) total++;
            if (!isRightEdge && squares[i + 1].classList.contains('mine')) total++;
            if (!isRightEdge && !isBottomEdge && squares[i + 1 + width].classList.contains('mine')) total++;
            if (!isBottomEdge && squares[i + width].classList.contains('mine')) total++;
            if (!isBottomEdge && !isLeftEdge && squares[i - 1 + width].classList.contains('mine')) total++;
            squares[i].setAttribute('data', total.toString());
        }
      }
    }

    createBoard();

    restart!.addEventListener('click', function(e) {
        restartBoard();
    });

    function addFlag(square: HTMLDivElement) {
        if (isGameOver) return;
        if (square.classList.contains('checked')) return;
        if (flags >= mineAmount && !square.classList.contains('flag')) return;

        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
            flags++;
            flagsLeft!.innerHTML = (mineAmount - flags).toString();
            checkForWin();
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
            flagsLeft!.innerHTML = (mineAmount - flags).toString();
        }
    }

    function userClickedSquare(square: HTMLElement) {
        let currentId = square.id;
        if (isGameOver || square.classList.contains('flag')) return;
        if (square.classList.contains('checked')) {
            const total = Number(square.getAttribute('data'));
            if (total > 0) {
                const flagCount = getFlagCount(+currentId);
                if (total === flagCount) {
                    checkSquare(square, +currentId);
                }
            }
            return;
        }

        clickSquare(square);
    }

    function clickSquare(square: HTMLElement) {
        let currentId = square.id;
        if (isGameOver || square.classList.contains('flag') || square.classList.contains('checked')) return;

        if (square.classList.contains('mine')) {
            gameOver(square);
            return;
        }
        const total = Number(square.getAttribute('data'));
        square.classList.add('checked');
        if (total > 0) {
            if (total === 1) square.classList.add('one');
            else if (total === 2) square.classList.add('two');
            else if (total === 3) square.classList.add('three');
            else if (total === 4) square.classList.add('four');
            square.innerHTML = total.toString();
        } else {
            checkSquare(square, +currentId);
        }
        checkForWin();
    }

    function checkSquare(square: HTMLElement, currentId: number) {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;
        const isTopEdge = currentId < width;
        const isBottomEdge = currentId >= width * height - width;

        setTimeout(() => {
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

    function gameOver(losingSquare: HTMLElement) {
        result!.innerHTML = 'BOOM! Game Over!';
        isGameOver = true;
        losingSquare.innerHTML = '💥';

        // Show all the mines.
        squares.forEach(square => {
            if (square.classList.contains('mine') && square !== losingSquare && !square.classList.contains('flag')) {
                square.innerHTML = '💣';
                square.classList.remove('mine');
                square.classList.add('checked');
            } else if (!square.classList.contains('mine') && square.classList.contains('flag')) {
                square.innerHTML = '❌';
            }
        });
    }

    function checkForWin() {
        let clickedSquares = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('checked')) {
                clickedSquares++;
            }
        }
        if (clickedSquares === width * height - mineAmount) {
            flagsLeft!.innerHTML = '0';
            result!.innerHTML = 'YOU WIN!';
            isGameOver = true;
            squares.forEach(square => {
                if (square.classList.contains('mine') && !square.classList.contains('flag')){
                    square.innerHTML = '🚩';
                }
            });
            return;
        }
    }

    function restartBoard() {
        result!.innerHTML = '';
        isGameOver = false;
        squares = [];
        flags = 0;

        while (grid!.firstChild) {
            grid!.removeChild(grid!.firstChild);
        }

        createBoard();
    }

    function getFlagCount(currentId: number): number {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;
        const isTopEdge = currentId < width;
        const isBottomEdge = currentId >= width * height - width;
        let flagCount = 0;

        if (!isLeftEdge) {
            const newId = squares[currentId - 1].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isLeftEdge && !isTopEdge) {
            const newId = squares[currentId - 1 - width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isTopEdge) {
            const newId = squares[currentId - width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isTopEdge && !isRightEdge) {
            const newId = squares[currentId + 1 - width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isRightEdge) {
            const newId = squares[currentId + 1].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isRightEdge && !isBottomEdge) {
            const newId = squares[currentId + 1 + width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isBottomEdge) {
            const newId = squares[currentId + width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }
        if (!isBottomEdge && !isLeftEdge) {
            const newId = squares[currentId - 1 + width].id;
            const newSquare = document.getElementById(newId);
            if (newSquare?.classList.contains('flag')) flagCount++;
        }

        return flagCount;
    }
});
