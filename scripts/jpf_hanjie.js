"use strict";

/*

   Author: Laura Coombs
   Date:   May 22, 2024

   Global Variables
   ================

   puzzleCells
      References the TD cells within the Hanjie table grid.

   cellBackground
      Stores the current background color of the puzzle
      cells during the mouseover event.


   Function List
   =============

   init()
      Run when the web page is loaded; displays puzzle 1
      and loads the event handlers for the web page buttons.

   setupPuzzle()
      Sets up a new puzzle, adding the event handlers for
      every puzzle cell.

   swapPuzzle(e)
      Swaps one puzzle for another based on the button being clicked
      by the user. Confirms the change before swapping in the
      new puzzle.

   setBackground(e)
      Sets the background color of the puzzle cells during the mousedown
      event

   extendBackground(e)
      Extends the background color of the original puzzle cell during
      the mouse enter event.

   endBackground()
      Ends the action of extending the cell backgrounds in response to the
      mouseup event.

   drawPuzzle(hint, rating, puzzle)
      Returns a text string of the HTML code to
      display a hanjie Web table based on the contents of
      multi-dimensional array, puzzle.

*/


/* ================================================================= */
window.onload = init;
// Global Variables
var puzzleCells;
var cellBackground;

// INIT FUNCTION
function init() {
   // insert title of the puzzle
   document.getElementById("puzzleTitle").innerHTML = "Puzzle 1";

   // insert the HTML code for the first puzzle
   document.getElementById("puzzle").innerHTML =
     drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);

   // prepare buttons to be clicked
   // add event handlers for the 3 puzzle buttons

   var puzzleButtons = document.getElementsByClassName("puzzles");
   for (var i = 0; i < puzzleButtons.length; i++) {
      puzzleButtons[i].onclick = swapPuzzle;
   }
   setupPuzzle();

   // Add event listener for the mouse up event
   document.addEventListener("mouseup", endBackground);
   // Add event listener to show the solution button
   document.getElementById("solve").addEventListener("click",
     function() {
      // remove all the inline background color styles from the cells
        for (var i= 0; i < puzzleCells.length; i++) {
           puzzleCells[i].style.backgroundColor = "";
        }
   })
}

// SETUP PUZZLE FUNCTION
function setupPuzzle() {
   // get all the puzzle cells
   puzzleCells = document.querySelectorAll("table#hanjieGrid td");

   // set the initial color of each cell to be gold
   for (var i = 0; i < puzzleCells.length; i++) {
      puzzleCells[i].style.backgroundColor = "rgb(233,207,29)"
      // set cell color in response to mousedown event
      puzzleCells[i].onmousedown = setBackground;
      // use pencil cursor when hovering over a cell
      puzzleCells[i].style.cursor = "url(images/jpf_pencil.png), pointer"
   }

   // check for puzzle solution

   document.getElementById("hanjieGrid").addEventListener("mouseup",
   function () {
      var solved = true;
      for (var i = 0; i < puzzleCells.length; i++) {
         if ((puzzleCells[i].className === "filled" && puzzleCells[i].style.backgroundColor !== "rgb(101, 101, 101)") ||
             (puzzleCells[i].className === "empty" && puzzleCells[i].style.backgroundColor === "rgb(101, 101, 101)")) {
            solved = false;
            break;
         }
      }
      if (solved) alert("You solved the puzzle!")
   })

   // create object collections of the filled and empty cells
   var filled = document.querySelectorAll("table#hanjieGrid td.filled");
   var empty = document.querySelectorAll("table#hanjieGrid td:not(.filled)");

   // Create an event listener to highlight the incorrect cells
   document.getElementById("peek").addEventListener("click",
     function () {
        // display incorrect white cells in pink
        for (var i = 0; i < filled.length; i++) {
           if (filled[i].style.backgroundColor === "rgb(255, 255, 255)") {
              filled[i].style.backgroundColor = "rgb(255, 211, 211)";
           }
        }
        // display incorrect gray cells in red
        for (var i = 0; i < empty.length; i++) {
           if (empty[i].style.backgroundColor === "rgb(101, 101, 101)") {
              empty[i].style.backgroundColor = "rgb(255, 101, 101)";
           }
        }
      // remove the highlighting after .5 second
      setTimeout(
        function () {
           for (var i = 0; i < puzzleCells.length; i++) {
              // change red cells back to gray
              if (puzzleCells[i].style.backgroundColor === "rgb(255, 101, 101)") {
                 puzzleCells[i].style.backgroundColor = "rgb(101, 101, 101)";
              }
              // change pink cells back to white
              if (puzzleCells[i].style.backgroundColor === "rgb(255, 211, 211)") {
                 puzzleCells[i].style.backgroundColor = "rgb(255, 255, 255)";
              }
           }
        }, 500);

     }
   );

}
// SWAP PUZZLE FUNCTION
function swapPuzzle(e) {
   if (confirm("You will lose all of your work on the puzzle! Continue?")) {
      // remove the event listener for the mouseup event

      var puzzleId = e.target.id;
      document.getElementById("puzzleTitle").innerHTML = e.target.value;

      switch (puzzleId) {
         case "puzzle1":
            document.getElementById("puzzle").innerHTML =
              drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);
            break;
         case "puzzle2":
             document.getElementById("puzzle").innerHTML =
               drawPuzzle(puzzle2Hint, puzzle2Rating, puzzle2);
             break;
         case "puzzle3":
             document.getElementById("puzzle").innerHTML =
               drawPuzzle(puzzle3Hint, puzzle3Rating, puzzle3);
             break;
      }
      setupPuzzle();
   }
}

// END BACKGROUND FUNCTION
function endBackground() {
   // Remove the event LISTENER for every puzzle cell
   for (var i=0; i < puzzleCells.length; i++) {
      puzzleCells[i].removeEventListener("mouseenter", extendBackground);
   }
}

// SET BACKGROUND FUNCTION
function setBackground(e) {
   var cursorType

   if (e.shiftKey) {
      cellBackground = "rgb(233,207,29)";
      cursorType = "url(images/jpf_eraser.png), cell";
   } else if (e.altKey) {
      cellBackground = "rgb(255,255,255)";
      cursorType = "url(images/jpf_cross.png), crosshair";
   } else {
      cellBackground = "rgb(101, 101, 101)";
      cursorType = "url(images/jpf_pencil.png), pointer";
   }

   e.target.style.backgroundColor = cellBackground
   // Create an event LISTENER for every puzzle cell
   for (var i= 0; i < puzzleCells.length; i++) {
      puzzleCells[i].addEventListener("mouseenter", extendBackground);
      puzzleCells[i].style.cursor = cursorType;
   }
   // prevent default action of selecting text
   e.preventDefault();
}

// EXTEND BACKGROUND FUNCTION
function extendBackground(e) {
    e.target.style.backgroundColor = cellBackground;

}

function drawPuzzle(hint, rating, puzzle) {

   /* Initial HTML string for the Hanjie Puzzle */
   var htmlString = "";

   /* puzzle is a multidimensional array containing the
      Hanjie puzzle layout. Marked cells are indicated by
      the # character. Empty cells are indicated by an
      empty text string. First, determine the number of rows
      and columns in the puzzle */

   var totalRows = puzzle.length;
   var totalCols = puzzle[0].length;

   /* Loop through the rows to create the rowCount array
      containing the totals for each row in the puzzle */

   var rowCount = [];
   var spaceCount;
   for (var i = 0; i < totalRows; i++) {
      rowCount[i]="";
      spaceCount = 0;

      for (var j = 0; j < totalCols; j++) {
         if (puzzle[i][j] === "#") {
            spaceCount++;
            if (j === totalCols-1) {
               rowCount[i] += spaceCount + "&nbsp;&nbsp;";
            }
         } else {
            if (spaceCount > 0) {
               rowCount[i] += spaceCount + "&nbsp;&nbsp;";
               spaceCount = 0;
            }
         }
      }

   }

   /* Loop through the columns to create the colCount array
      containing the totals for each column in the puzzle */

   var colCount = [];
   for (var j = 0; j < totalCols; j++) {
      colCount[j]="";
      spaceCount = 0;

      for (var i = 0; i < totalRows; i++) {
         if (puzzle[i][j] === "#") {
            spaceCount++;
            if (i === totalRows-1) {
               colCount[j] += spaceCount + "<br />";
            }
         } else {
            if (spaceCount > 0) {
               colCount[j] += spaceCount + "<br />";
               spaceCount = 0;
            }
         }
      }

   }

   /* Create a Web table with the id, hanjieGrid, containing
      headers with the row and column totals.
      Each marked cell has the class name, marked; each
      empty cell has the class name, empty */

   htmlString = "<table id='hanjieGrid'>";
   htmlString += "<caption>" + hint + " (" + rating + ")</caption>";
   htmlString += "<tr><th></th>";

   for (var j = 0; j < totalCols; j++) {
      htmlString += "<th class='cols'>" + colCount[j] + "</th>";
   }
   htmlString += "</tr>";

   for (var i = 0; i < totalRows; i++) {
      htmlString += "<tr><th class='rows'>&nbsp;" + rowCount[i]+"</th>";

      for (var j = 0; j<totalCols; j++) {
         if (puzzle[i][j] === "#") {
            htmlString += "<td class='filled'></td>";
         }
         else {
            htmlString += "<td class='empty'></td>";
         }
      }

      htmlString += "</tr>";
   }

   htmlString += "</table>";

   return htmlString;
}
