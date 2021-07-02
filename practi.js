var tilecolourlist = []
var tilelist = ["tile","tile2","tile3","tile4","tile5","tile6","tile7","tile8","tile9",]
var puzzle = []
var correctsquares = []
var colourchoice = ["red", "green", "blue", "yellow", "orange", "purple", "black"]
var totalmoves = 0
var winner = false

$(document).ready(function(){
    reset()
    
})

// Function to reset the game
function reset(){
    winner = false;
    totalmoves = 0
    correctsquares = []
    puzzle = []
    tilecolourlist = []
    
    resetMain()
    checker = isSolvable()
    while (checker == false){
        checker = isSolveable()
    }
    // Function to create a puzzle
    resetChange()
    document.getElementById("moves").innerHTML = "Moves: " + totalmoves;
    document.getElementById("Winner").innerHTML = "Match each square on the right to the same colour as their counterpart on the left by left or right clicking on them to change their colour!";
    document.getElementById("Winner").style.marginRight = "-550px";

}
//Function to set the colours of randomize tiles on the left, and include 1 blank
function resetMain(){
    let colouralt = document.getElementById('tile-alt');
    colouralt.className = randomChoice(colourchoice);
    tilealtadder(colouralt.className)

    let colour2alt = document.getElementById('tile2-alt');
    colour2alt.className = randomChoice(colourchoice);
    tilealtadder(colour2alt.className)

    let colour3alt = document.getElementById('tile3-alt');
    colour3alt.className = randomChoice(colourchoice);
    tilealtadder(colour3alt.className)

    let colour4alt = document.getElementById('tile4-alt');
    colour4alt.className = randomChoice(colourchoice);
    tilealtadder(colour4alt.className)

    let colour5alt = document.getElementById('tile5-alt');
    colour5alt.className = randomChoice(colourchoice);
    tilealtadder(colour5alt.className)

    let colour6alt = document.getElementById('tile6-alt');
    colour6alt.className = randomChoice(colourchoice);
    tilealtadder(colour6alt.className)

    let colour7alt = document.getElementById('tile7-alt');
    colour7alt.className = randomChoice(colourchoice);
    tilealtadder(colour7alt.className)

    let colour8alt = document.getElementById('tile8-alt');
    colour8alt.className = randomChoice(colourchoice);
    tilealtadder(colour8alt.className)

    let colour9alt = document.getElementById('tile9-alt');
    colour9alt.className = 'blank';
    tilealtadder(colour9alt.className)

    //This will also set the game state to have 8 randomly chosen colours, and a blank
}

function tilealtadder(colour){
    tilecolourlist.push(colour)
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }


function puzzleMaker(){
    // Code to remove colour from tilelist, i.e avoid duplication
    // Each code corresponds to a colour index in tilecolourlist. This creates a puzzle, then removes the number is has selected for that square
    numbers = [0,1,2,3,4,5,6,7,8]
    topline = []
    for (let i = 0; i < 3; i ++){
        topline.push(randomChoice(numbers))
        if (numbers.includes(topline[i])){
            index = numbers.indexOf(topline[i])
            numbers.splice(index, 1);
        }
    }
    middleline = []
    for (let i = 0; i < 3; i ++){
        middleline.push(randomChoice(numbers))
        if (numbers.includes(middleline[i])){
            index = numbers.indexOf(middleline[i])
            numbers.splice(index, 1);
        }
    }
    bottomline = []
    for (let i = 0; i < 3; i ++){
        bottomline.push(randomChoice(numbers))
        if (numbers.includes(bottomline[i])){
            index = numbers.indexOf(bottomline[i])
            numbers.splice(index, 1);
        }
    }
    return [[topline], [middleline], [bottomline]]
    

}
// Function to determine if puzzle would be solveable, and create a list based upon tile order therefore
function getInvCount(arr){
    let inv_count = 0 ;
    for(let i=0;i<2;i++){
        for(let j=i+1;j<3;j++){
         
            // Value 0 is used for empty space
            if (arr[j][i] > 0 && arr[j][i] > arr[i][j])
                inv_count += 1;
        }
     }
    return inv_count;
}
// This function returns true
// if given 8 puzzle is solvable.
function isSolvable()
{
    puzzle = puzzleMaker()
    // Count inversions in given 8 puzzle
    let invCount = getInvCount(puzzle);
    // return true if inversion count is even.
    return (invCount % 2 == 0);
}

// Code to set tile to random colour from tilelist
function resetChange(){
    let colour = document.getElementById('tile');
    colour.className = colourSelector(0,0)

    let colour2 = document.getElementById('tile2');
    colour2.className = colourSelector(0,1)

    let colour3 = document.getElementById('tile3');
    colour3.className = colourSelector(0,2)

    let colour4 = document.getElementById('tile4');
    colour4.className = colourSelector(1,0)

    let colour5 = document.getElementById('tile5');
    colour5.className = colourSelector(1,1)

    let colour6 = document.getElementById('tile6');
    colour6.className = colourSelector(1,2)

    let colour7 = document.getElementById('tile7');
    colour7.className = colourSelector(2,0)

    let colour8 = document.getElementById('tile8');
    colour8.className = colourSelector(2,1)

    let colour9 = document.getElementById('tile9');
    colour9.className = colourSelector(2,2)
}

function colourSelector(idx1, idx2){
    selectionindex = puzzle[idx1][0][idx2]
    colour = tilecolourlist[selectionindex]
    return colour
}



// Function which allows movement of the tiles, documented in the notepad
function changeColour(square){
    if (winner === false){
    index = tilelist.indexOf(square.id)
    blank = document.getElementsByClassName('blank')[1]
    index2 = tilelist.indexOf(blank.id)

    // 0    1   2
    // 3    4   5
    // 6    7   8

    //if index - 3 === index2
    if (index - 3 === index2){
        blankplaceholder = blank.className
        blank.className = square.className
        square.className = blankplaceholder
    }
    // if index + 3 === index2
    if (index + 3 === index2){
        blankplaceholder = blank.className
        blank.className = square.className
        square.className = blankplaceholder
    }
    if (index !== 2 && index !== 5){
        // if index + 1 === index2
        if (index + 1 === index2){
            blankplaceholder = blank.className
            blank.className = square.className
            square.className = blankplaceholder
        }
    }
    // if index - 1 === index2
    if (index !== 3 && index !== 6){
    if (index - 1 === index2){
        blankplaceholder = blank.className
        blank.className = square.className
        square.className = blankplaceholder
    }
    }

    colourChecker()
    if (square.className != blank.className){
        totalmoves += 1
    }
    gameChecker()
    document.getElementById("moves").innerHTML = "Moves: " + totalmoves;
        
        
        
        
        
    }

}

function colourChecker(){
    tile = document.getElementById('tile');
    tile2 = document.getElementById('tile2');
    tile3 = document.getElementById('tile3');
    tile4 = document.getElementById('tile4');
    tile5 = document.getElementById('tile5');
    tile6 = document.getElementById('tile6');
    tile7 = document.getElementById('tile7');
    tile8 = document.getElementById('tile8');
    tile9 = document.getElementById('tile9');

    correcttilelist = []
    correcttilelist.push(tile.className, tile2.className, tile3.className, tile4.className, tile5.className, tile6.className, tile7.className, tile8.className, tile9.className)


    tilealt = document.getElementById('tile-alt');
    tile2alt = document.getElementById('tile2-alt');
    tile3alt = document.getElementById('tile3-alt');
    tile4alt = document.getElementById('tile4-alt');
    tile5alt = document.getElementById('tile5-alt');
    tile6alt = document.getElementById('tile6-alt');
    tile7alt = document.getElementById('tile7-alt');
    tile8alt = document.getElementById('tile8-alt');
    tile9alt = document.getElementById('tile9-alt');
    correcttilealtlist = []
    correcttilealtlist.push(tilealt.className, tile2alt.className, tile3alt.className, tile4alt.className, tile5alt.className, tile6alt.className, tile7alt.className, tile8alt.className, tile9alt.className)

    //Add all classnames to a 2 different lists, check each index against one another, append correct tiles to correct squares and remove if in correct squares and incorrect
    for (let i = 0; i < 9; i++){
        console.log(correcttilelist[i])
        console.log(correcttilealtlist[i])
        if (correcttilelist[i] == correcttilealtlist[i]){
            checker = correctsquares.includes(tilelist[i])
            if (checker == false){
                correctsquares.push(tilelist[i])
            }
        }
        if (correcttilelist[i] != correcttilealtlist[i]){
            checker = correctsquares.includes(tilelist[i])

            if (checker == true){
                index = correctsquares.indexOf(tilelist[i])
                correctsquares.splice(index, 1);
            }
        }
    }
    console.log(correctsquares)
}
function gameChecker(){
    if (correctsquares.includes("tile") && correctsquares.includes("tile2") && correctsquares.includes("tile3") && correctsquares.includes("tile4") && correctsquares.includes("tile5") && correctsquares.includes("tile6") && correctsquares.includes("tile7") && correctsquares.includes("tile8") && correctsquares.includes("tile9") ){
      winner = true;
      $(document).ready(function(){
        $.ajax({
          global: false,
          type: 'POST',
          url: "/submission",
          dataType: 'html',
          data: {
              score: totalmoves,
              game: "Rubick"
          },
          success: function (result) {
              pass
          },
          error: function (request, status, error) {
              serviceError();
          }
      });
    });
      document.getElementById("Winner").innerHTML = "Well done, you have solved the puzzle in " + totalmoves + " moves. Reset the game to try again";
      document.getElementById("Winner").style.marginRight = "-300px";
      
  }
}




// Function to determine minimum moves, therefore whether it is solveable
// Function which calculates win
