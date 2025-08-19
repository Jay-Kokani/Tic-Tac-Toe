let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let gameContainer = document.querySelector(".container");
let nameForm = document.querySelector(".name-form");

let player1Name = "";
let player2Name = "";
let turnO = true;
let count = 0;

// Hide game board initially
gameContainer.style.display = "none";

const createBalloons = () => {
    const balloonContainer = document.createElement('div');
    balloonContainer.className = 'balloon-container';
    
    // Create 15 balloons with random positions
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDelay = `${Math.random() * 0.5}s`;
        balloonContainer.appendChild(balloon);
    }
    
    document.body.appendChild(balloonContainer);
    
    // Remove the balloons after animation
    setTimeout(() => {
        document.body.removeChild(balloonContainer);
    }, 5000);
};

const celebrateWin = () => {
    // Create balloons
    createBalloons();

    // Fire confetti from the left edge
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.1, y: 0.8 }
    });

    // Fire confetti from the right edge
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.8 }
    });

    // Fire confetti from the middle
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.9 },
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
    }, 250);

    // Create a confetti cannon effect
    let end = Date.now() + 2000;
    let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
};

// Handle game start
document.querySelector("#start-game").addEventListener("click", () => {
    player1Name = document.querySelector("#player1").value.trim();
    player2Name = document.querySelector("#player2").value.trim();
    
    if (player1Name === "" || player2Name === "") {
        alert("Please enter names for both players!");
        return;
    }
    
    nameForm.style.display = "none";
    gameContainer.style.display = "block";
    resetGame();
});

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            turnO = false;
        } else {
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        }
    });
});

const gameDraw = () => {
    msg.innerText = 'Game was a Draw.';
    msgContainer.classList.remove("hide");
    disableBoxes();
}

const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    const winnerName = winner === "O" ? player1Name : player2Name;
    msg.innerText = `Congratulations ${winnerName}, You Won!`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    celebrateWin(); // Enhanced celebration
};

const checkWinner = () => {
    for(let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText; 
        let pos3val = boxes[pattern[2]].innerText;

        if(pos1val != "" && pos2val != "" && pos3val != "") {
            if(pos1val === pos2val && pos2val === pos3val) {
                showWinner(pos1val);
                return true;
            }
        }    
    }
    return false;
};

newGameBtn.addEventListener("click", () => {
    nameForm.style.display = "block";
    gameContainer.style.display = "none";
    resetGame();
});

resetBtn.addEventListener("click", resetGame);
