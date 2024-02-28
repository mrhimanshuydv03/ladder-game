const n = 10;
const matrixArray = [];
var starttime;
var endtime;

const ladderMap = {
    3: ["I question everything!", 22],
    7: ["I am regular and punctual.", 31],
    51: ["I work proactively.", 95],
    24: ["I work on the feedback given.", 44],
    43: ["I completed my 6 tasks on time!", 80],
    35: ["I participated in sessions!", 49],
    60: ["I mastered the BDD!", 87],
    67: ["I solved an allemp query!", 81]
};

const snakeMap = {
    16: ["I came late to work.", 4],
    39: ["It’s 10 am! I have not sent a leave application!", 19],
    63: ["My email has typos and errors!", 23],
    85: ["I did not cc Daily Interns Reporting.", 47],
    88: ["I missed my deadline", 28],
    48: ["I was stuck but didn’t ask on allemp.", 57],
    69: ["I completed the task but did not submit it.", 33],
    97: ["Bad quality of work.", 77],
};


const LADDER_CLASS = "ladder";
const SNAKE_CLASS = "snake";

function createMatrix() {
    if (!localStorage.getItem("currentUser")) {
        window.location.replace("/login-form/");
    }
    starttime = new Date()

    let block = n * n + 1;
    for (let column = 1; column <= n; column++) {
        let rows = [];
        if (column % 2 === 0) {
            block = block - n;
            let value = block;
            for (let row = 1; row <= n; row++) {
                rows.push(value);
                value++;
            }
        } else {
            for (let row = 1; row <= n; row++) {
                block = block - 1;
                rows.push(block);
            }
        }
        matrixArray.push(rows);
    }
    createBoard(matrixArray);
}

function createBoard(matrixArray) {
    const board = document.querySelector(".main-board");
    let str = "";
    matrixArray.map((row) => {
        str += `<div class="row">`;
        row.map((block) => {
            str += `
                    <div class="block ${ladderMap[block] ? LADDER_CLASS : ""} ${
                        snakeMap[block] ? SNAKE_CLASS : ""
                    } ${block === 1 ? "active" : ""} " data-value=${block}>
                    ${block}
                    </div>
                `;
        });
        str += `</div>`;
    });
    board.innerHTML = str;
}

const startTime1 = new Date();

function roll() {
    const dice = document.querySelector("img");
    dice.classList.add("rolling"); // Add rolling animation class

    setTimeout(() => {
        dice.classList.remove("rolling"); // Remove rolling animation class after delay
        const diceValue = Math.ceil(Math.random() * 6);
        document
            .querySelector("#dice-id")
            .setAttribute("src", `assets/dice${diceValue}.png`);
        changeCurrentPosition(diceValue);
    }, 1000);
    // -AnimationEffect("rollDice")// Adjust as needed, should match the duration of rolling animation
}

const profit=[];
const loss=[];



function changeCurrentPosition(diceValue) {
    const activeBlock = document.querySelector(".active");
    const activeBlockValue = parseInt(activeBlock.outerText);
    let presentValue = diceValue + activeBlockValue;

    // Check if the presentValue is in the ladderMap
    if (ladderMap[presentValue]) {
        // Show ladder message using SweetAlert2
        profit.push(presentValue)
        Swal.fire({
            // title: 'A!',
            html: `${ladderMap[presentValue][0].replace(/\n/g, "<br> <br>")}`, //<br> ${ladderMap[presentValue][1]}`,
            confirmButtonText: "OK",
        });

        // Set presentValue to the ladder's destination
        presentValue = ladderMap[presentValue][1];
    }

    // Check if the presentValue is in the snakeMap
    if (snakeMap[presentValue]) {
        loss.push(presentValue)
        // Show snake message using SweetAlert2
        Swal.fire({
            // title: "A!",
            html: `${snakeMap[presentValue][0].replace(/\n/g, "<br> <br>")}`, //<br>${snakeMap[presentValue][1]}`,
            confirmButtonText: "OK",
        });
        // Set presentValue to the snake's destination
        presentValue = snakeMap[presentValue][1];
    }
       
    // Move the user to the next position
    if (presentValue <= n * n) {
        changeActiveClass(presentValue);
    } else {
        if (isGameComplete()) {
            Swal.fire({
                title: "Congratulations!",
                text: "You have successfully completed InternShip Part-I.",
                icon: "success ",
                confirmButtonText: "Restart",
                imageUrl: "assets/cong.webp",
                imageAlt: "Your Image",
            }).then((result) => {
                if (result.isConfirmed) {
                    restart();
                }
            });
        } else {
            Swal.fire({
                title: "You've reached the end!",
                text: "But the game is not complete. Keep playing!",
                icon: "info",
                confirmButtonText: "OK",
            });
        }
    }
}

function changeActiveClass(presentValue) {
    const activeBlock = document.querySelector(".active");
    activeBlock.classList.remove("active");
    const block = document.querySelector(`[data-value="${presentValue}"]`);
    block.classList.add("active");
}

function isGameComplete() {
    const activeBlock = document.querySelector(".active");
    const lastBlock = document.querySelector(`[data-value="${n * n}"]`);
    lastBlock.setAttribute("src", "assets/ladder.png");

    if (activeBlock === lastBlock) {
        const uniqueProfit = [...new Set(profit)];
        const uniqueLoss= [...new Set(loss)];
        console.log(uniqueProfit,uniqueLoss)
        endtime = new Date();
        
        const localTime = (endtime-starttime) / 1000
        
        const data = {
            email: localStorage.getItem("currentUser"),
            // profit: [3, 7, 24],
            // loss: [16, 39, 48],
            profit:uniqueProfit,
            loss:uniqueLoss,
            time: Math.floor(Math.random() * 1000 + 1),
        };

        fetch("http://localhost:3000/attempt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem("dashboard", JSON.stringify(data));
                window.location.replace("/dashboard.html");
                console.log("Success:", data);
            })
            .catch((error) => {
                alert("error occured");
                console.error("Error:", error);
            });

        return true;
    }
    return false;
}

const endTime1 = new Date();

const totalTime = (endTime1 - startTime1) / 1000;

function restart() {
    matrixArray.length = 0;
    createMatrix();
    Swal.fire({
        title: "Game restarted",
        text: "Good luck!",
        icon: "success",
    });
}

// Initialize the game board
//createMatrix();

// JavaScript Code
// let startTime, endTime;

// function rollDice() {
//     // Roll the dice and generate a random number between 1 and 6
//     const diceResult = Math.floor(Math.random() * 6) + 1;

//     // Display the result of the dice roll
//     document.getElementById(
//         "diceResult"
//     ).innerText = `Dice Result: ${diceResult}`;

//     // If the game has not started yet, set the start time
//     if (!startTime) {
//         startTime = new Date();
//     }
// }

// function endGame() {
//     // If the end time is not set yet, set it and calculate the game duration
//     if (!endTime) {
//         endTime = new Date();
//         const timeDiff = endTime - startTime;
//         const seconds = Math.floor(timeDiff / 1000);

//         // Display the game duration
//         document.getElementById(
//             "gameTime"
//         ).innerText = `Game Time: ${seconds} seconds`;
//     }
// }

// // Simulate end of game after a certain time (e.g., 5 seconds)
// setTimeout(endGame, 5000); // Adjust as needed
// ======================================================
function quit() {
    // Redirect to the specified homepage
    window.location.href =
        "file:///home/himanshu/Documents/Foxians%20Game%20Project/login-form/index.html";
}
function restart() {
    // Perform actions to restart the game
    matrixArray.length = 0;
    createMatrix();
    document.querySelector("#user-score").innerText = "User Score: 0"; // Reset user score
    Swal.fire({
        title: "Game restarted",
        text: "Good luck!",
        icon: "success",
    });
}

// profile icon logic

function logout() {
    localStorage.removeItem("currentUser");
    window.location.replace("/login-form/");
}

// Add an event listener to track mouse movement
document.addEventListener("mousemove", highlightBlock);

// Define the positions to highlight along with their corresponding targets
const highlightPositions = {
    3: 22,
    7: 31,
    51: 95,
    24: 44,
    43: 80,
    35: 49,
    60: 87,
    67: 81
};

function highlightBlock(event) {
    // Get the x and y coordinates of the mouse cursor
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Loop through the highlightPositions object
    for (const position in highlightPositions) {
        // Find the block corresponding to the current position
        const block = document.querySelector(`[data-value="${position}"]`);

        // Get the position and dimensions of the block
        const blockRect = block.getBoundingClientRect();

        // Check if the mouse cursor is within the boundaries of the block
        if (
            mouseX >= blockRect.left &&
            mouseX <= blockRect.right &&
            mouseY >= blockRect.top &&
            mouseY <= blockRect.bottom
        ) {
            // Highlight the target block in green color
            const targetBlock = document.querySelector(`[data-value="${highlightPositions[position]}"]`);
            if (targetBlock) {
                targetBlock.style.backgroundColor = "green";
            }
        } else {
            // Reset the highlight if the mouse cursor is not over the block
            const targetBlock = document.querySelector(`[data-value="${highlightPositions[position]}"]`);
            if (targetBlock) {
                targetBlock.style.backgroundColor = ""; // Reset to default color
            }
        }
    }
}


// Add an event listener to track mouse movement for red highlighting
document.addEventListener("mousemove", highlightRedBlock);

// Define the positions to highlight in red along with their corresponding targets
const highlightRedPositions = {
    16: 4,
    39: 19,
    63: 23,
    85: 47,
    88: 28,
    48: 30,
    69: 33,
    97: 77
};

function highlightRedBlock(event) {
    // Get the x and y coordinates of the mouse cursor
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Loop through the highlightRedPositions object
    for (const position in highlightRedPositions) {
        // Find the block corresponding to the current position
        const block = document.querySelector(`[data-value="${position}"]`);

        // Get the position and dimensions of the block
        const blockRect = block.getBoundingClientRect();

        // Check if the mouse cursor is within the boundaries of the block
        if (
            mouseX >= blockRect.left &&
            mouseX <= blockRect.right &&
            mouseY >= blockRect.top &&
            mouseY <= blockRect.bottom
        ) {
            // Highlight the target block in red color
            const targetBlock = document.querySelector(`[data-value="${highlightRedPositions[position]}"]`);
            if (targetBlock) {
                targetBlock.style.backgroundColor = "red";
            }
        } else {
            // Reset the highlight if the mouse cursor is not over the block
            const targetBlock = document.querySelector(`[data-value="${highlightRedPositions[position]}"]`);
            if (targetBlock) {
                targetBlock.style.backgroundColor = ""; // Reset to default color
            }
        }
    }
}
