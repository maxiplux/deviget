/**
 * Minesweeper (http://minesweeper.tomasreichmann.cz/)
 *
 * Minesweeper is a jQuery plugin that displays a classic Windows minesweeper game on a page 
 *
 * Features: 
 *	+ Custom board sizes and mine counts
 *	+ Touch friendly alternative controls
 *	+ Supports multiple boards per page
 *	+ Per user per page high scores with Local storage
 *	+ Per user per page persistent last settings   
 *	+ Debug option logs to firebug console
 *	+ Impossible to hit mine on the first cell
 * 
 * Tested in Firefox 3.6, MSIE 6, MSIE 7, Opera 11

 * MS IE has a couple of known bugs: no hover effect, rectangular squares, ...
 * I have no intention to solve them. If you want to pitch in with an easy fix 
 * I will gladly accept it but other than that I am spending not a single extra 
 * minute to solve stupid IE bugs.    
 * 
 * Version 0.9
 * Febuary 17, 2011
 *
 * Copyright (c) 2011 Tomas Reichmann (http://tomasreichmann.cz)
 * Licensed under the GPL licenses.
 * http://www.gnu.org/licenses/gpl.txt
 *
**/


(function($) {

/**
 * 
 * @desc Minesweeper is a jQuery plugin that displays a classic Windows minesweeper game on a page.
 * @author Tomas Reichmann
 * @version 0.9
 *
 * @name Minesweeper
 * @type jQuery
 *
 * @cat plugins/Games
 * 
 * @example $("#board2").minesweeper({ cols: 16, rows: 16, mines: 48, debug: true });
 * @options
 *   cols:      (integer) Number of columns for playing board.
 *   rows: 			(integer) Number of rows for playing board
 *   mines:   	(integer) Total number of mines on the field # > 0 && # < cols*rows
 *   difficulty:(string) A shortcut for cols, rows and mines setting. cols, rows,
 *   						mines take precedents if also difficulty is set [beginner, advanced, expert, custom]
 *   debug:			(boolean) with true logs events into firebug console
**/

	$.fn.minesweeper = function(settings) {
		var showMenu = false;
		// if no settings specified, menu will appear
		if(settings == undefined){
			showMenu = true;
		}
		// set default configuration
		settings = jQuery.extend({
				// game settings
				CustomVars:{},
				cols: 		9,		// (integer) Number of columns for playing board.
				rows:			9,		// (integer) Number of rows for playing board
				mines:		10,		// (integer) Total number of mines on the field # > 0 && # < cols*rows
				difficulty:	"beginner" ,		// (string) A shortcut for cols, rows and mines setting. cols, rows, mines take precedents if also difficulty is set [beginner, advanced, expert, custom]
				// debug
				debug:			false		// (boolean) with true logs events into firebug console
			},settings);

/* Difficulty object */
function difficulty(cols, rows, mines){
	this.cols = cols;
	this.rows = rows;
	this.mines = mines;
}
		// default difficulty settings cols, rows, mines
		var difficulty_beginner = new difficulty(9,9,10);
		var difficulty_advanced = new difficulty(16,16,40);
		var difficulty_expert = new difficulty(30,16,99);
		
		//global variables
		var container = this;
		var matrix;
		var gameFinished;
		var round;
		var foundMines;
		var statusBar;
		var minesLeft;
		var flagButton;
		var stopwatch;
		var stopwatchMinutes;
		var stopwatchSeconds;
		var stopwatchInterval;
		
		log(settings);
		
		// If settings are valid:  initialize
		var settingsCheck = checkSettings();
		if ( settingsCheck == true && showMenu == false ){
			log("settings OK, no menu needed");
			init(); // initialize
		}
		else { // if settings are invalid or not present
			// get last settings from local storage
			if (typeof(localStorage) != "undefined" ) {
				log("local storage is available");
				try {
					if ( localStorage.getItem("minesweeperCurrentSettings" ) ){
						var raw = localStorage.getItem("minesweeperCurrentSettings" );
						raw = raw.split("|");
						settings.difficulty = raw[0];
						settings.cols = raw[1];
						settings.rows = raw[2];
						settings.mines = raw[3];
						log("settings loaded successfuly from local storage");
					}
					else {
						log("no previously saved settings in localstorage");
					}
				}
				catch (e) {
					log("Localstorage error!", "error"); 
					log(e, "error"); 
				}
			}
			renderMenu(); // render menu
		}

// only functions bellow this point

/* functions renders menu for manula settings input and than saves it in local storage */
function renderMenu(){
	
	log("rendering menu started");
	var menu = $("<div></div>");
	$(menu).addClass("minesweeper-menu");
	var html = "";

	var checked_difficulty_custom = "";
	var checked_difficulty_beginner = "";
	var checked_difficulty_advanced = "";
	var checked_difficulty_expert = "";
	// Checks selected difficulty
	switch (settings.difficulty) {
		case "custom":
			checked_difficulty_custom = 'checked="checked"';
			break;
		case "beginner":
			checked_difficulty_beginner = 'checked="checked"';
			break;
		case "advanced":
			checked_difficulty_advanced = 'checked="checked"';
			break;
		case "expert":
			checked_difficulty_expert = 'checked="checked"';
			break;
		default:
			checked_difficulty_custom = 'checked="checked"';
	}
	
	html += '<ul class="menu">' +"\n";
	html += '<li><label>Difficulty:</label><span class="radio-wrap">' +"\n";
	html += '<input name="menu_difficulty" type="radio" class="radio" value="custom" '+ checked_difficulty_custom +' /><label class="radio" >custom</label>' +"\n";
	html += '<input name="menu_difficulty" type="radio" class="radio" value="beginner" '+ checked_difficulty_beginner +' /><label class="radio" >beginner</label>' +"\n";
	html += '<input name="menu_difficulty" type="radio" class="radio" value="advanced" '+ checked_difficulty_advanced +' /><label class="radio" >advanced</label>' +"\n";
	html += '<input name="menu_difficulty" type="radio" class="radio" value="expert" '+ checked_difficulty_expert +' /><label class="radio" >expert</label>' +"\n";
	html += '</span></li>' +"\n";
	html += '<li><label >Columns:</label> <input class="text" name="menu_cols" type="text" value="'+settings.cols+'" /></li>' +"\n";
	html += '<li><label >Rows:</label> <input class="text" name="menu_rows" type="text" value="'+settings.rows+'" /></li>' +"\n";
	html += '<li><label >Number of mines:</label> <input class="text" name="menu_mines" type="text" value="'+settings.mines+'" /></li>' +"\n";
	html += '<li><span class="menu-button new-game" >Start</span></li>' +"\n";
	html += '</ul>' +"\n";
	$(menu).append( html );

	// menu onchange event handling 
	$(menu).find("input").change( function(){
		var obj = $(this).attr("name");
		if (obj == "menu_difficulty"){
			var switchCase = $(this).val();
			var currentDifficulty = false;
			switch ( switchCase ){
				case "custom":
					break;
				case "beginner":
					currentDifficulty = difficulty_beginner;
					break;
				case "advanced":
					currentDifficulty = difficulty_advanced;
					break;
				case "expert":
					currentDifficulty = difficulty_expert;
					break; 
				default:
					log("menu on change switch case error" + switchCase, "error");
			}
			if (currentDifficulty != false){
				$(menu).find("input[name=menu_cols]").val(currentDifficulty.cols); 
				$(menu).find("input[name=menu_rows]").val(currentDifficulty.rows); 
				$(menu).find("input[name=menu_mines]").val(currentDifficulty.mines);
			}
		}
		else {
			$(menu).find("input[value=custom]").click(); // check custom radio
		}
	});
	
	// new-game button click event saves settings, checks them and either initiates new game or 
	$(menu).find(".new-game").click( function()
	{
		$(menu).find("input").each( function()
		{
			var switchCase = $(this).attr("name");
			switch ( switchCase )
			{
				case "menu_difficulty" :
					if ( $(this).attr('checked') ){
						settings.difficulty = $(this).val(); 
					}
					break;
				case "menu_cols" :	
					settings.cols = $(this).val();
					break;
				case "menu_rows" :
					settings.rows = $(this).val();
					break;
				case "menu_mines" :
					settings.mines = $(this).val();
					break;
				default:
					log("menu input switch case error" + switchCase, "error");
			}

		});
		
		log("settings updated from menu");
		
		settingsCheck = checkSettings();
		if( settingsCheck != true ){
			alert("settings incorrect");
		}
		else {
			log("settings OK, trying to save to local storage");
			// save settings into local storage
			if (typeof(localStorage) != "undefined" ) {
				try {
					localStorage.setItem("minesweeperCurrentSettings", settings.difficulty + "|" + settings.cols + "|" + settings.rows + "|" + settings.mines ); //saves to the database, “key”, “value”
					log("save into local storage successfull");
				}
				catch (e) {
					log("Localstorage error!\nSettings NOT saved!", "error"); //data wasn’t successfully saved
					log(e, "error");
				}
			}
			
			$(container).html(""); // remove menu and everything else from container
			log("initiating ...");
			init(); // initialize
		}
		
		
	} ); 
	$(container).append(menu);
}


// Check whether settings are valid
function checkSettings(){
	log("commencing settings check");
	var errors = new Array();
	if (settings.cols % 1 != 0 || settings.cols < 1){
		errors.push("cols settings incorrect. cols: "+ settings.cols +" (settings.cols % 1 != 0 || settings.cols < 1");
	}
	if (settings.rows % 1 != 0 || settings.rows < 1){
		errors.push("rows settings incorrect. rows: "+ settings.rows +" (settings.rows % 1 != 0 || settings.rows < 1)");
	}
	if (settings.mines % 1 != 0 || settings.mines < 1 || (settings.mines >= settings.rows * settings.cols) ){
		errors.push("mines settings incorrect. mines: "+ settings.mines +" (settings.mines % 1 != 0 || settings.mines < 1 || (settings.mines >= settings.rows * settings.cols)");
	}
	// to-do: check difficulty
	// to-do: only check rows, cols, mines if no difficulty is set and vice versa
	if (errors.length > 0) {
		if (settings.debug == true) {
			log("Settings check failed!","error");
			for (e in errors){
				log(errors[e],"error");
			}
		}
		return errors;
	}
	else {
		log("Settings check successful");
		return true;
	}
}

function num2alfa(str) {
	num2alfaArray = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J" ];
	str = str + "";
	var newStr = "";
	for (x = 0; x < str.length ; x++){
		index = parseFloat( str.charAt(x) );
		newStr += num2alfaArray[index];
	}
	return newStr;
}

// Renders board cells and assigns click events
function renderBoard() {
	log("Board rendering started with: " + settings.cols + "x" + settings.rows);
	var cells = 0; //number of cells rendered
	var field = $("<div></div>")
	
	function flagCell (target){
		if(gameFinished == false){
			if ( $(target).hasClass("flag") ){
				$(target).removeClass("flag");
				foundMines--;
				update(minesLeft);
			}
			else {
				$(target).addClass("flag");
				foundMines++;
				update(minesLeft);
			}
			return false;
		}
		log("Game already finished. Start a new game to play some more");
	}
	
	$(field).addClass("field");
	for (var y = 0; y < settings.rows; y++){
		var row = $("<div></div>");
		$(row).addClass("row");
		matrix[y] = new Array();
		for (var x = 0; x < settings.cols; x++){
			var cell = $("<div>&nbsp;</div>");
			$(cell).data({"x":x, "y":y});
			$(cell).bind("contextmenu", function(e) {
				if(gameFinished == false){
					return flagCell(this);
				}
				else {
					alert("Refresh for a new game");
					return false;
				}
			});

			$(cell).click( function() { // cell click event
				if(gameFinished == false){
					if (round == 1){
						// start the stopwatch
						var update = function() {
							if (stopwatchSeconds == 59){
								stopwatchMinutes++;
								stopwatchSeconds = 0;
							}
							else {
								stopwatchSeconds++;
							}
							$(stopwatch).children("span").html( addZerosToNumber(stopwatchMinutes,2) + ":" + addZerosToNumber(stopwatchSeconds,2) );
						}
						stopwatchInterval = setInterval(update, 1000);
					}
					if ( $(flagButton).hasClass("pressed") == true ){
						return flagCell(this);
					}
					else if ( !$(this).hasClass("flag") ){ // disable clicking flagged cells
						$(this).addClass("revealed");
						// remove left and right click events
						$(this).unbind("click");
						$(this).unbind("contextmenu");
	
						var mines = mineCheck(this); // check for mines
						
						// redistribute mines if the player hit a mine on the first cell
						if( round == 1 && mines === true){
							log("stepped on a mine on the first round. Redistributing mines ...", "warn");
							// empty matrix
							for (mY in matrix ) {
								for (mX in matrix[mY] ) {
									$(matrix[mY][mX]).data("mine",false);
								}
							}
							layMines( $(this).data("x")*1, $(this).data("y")*1 ); // lay new mines, avoid clicked cell
							mines = mineCheck(this); // check for mines again
						}
						
						// player hit the mine
						if (mines === true)
						{
							clearTimeout(stopwatchInterval);
							
							gameFinished = true;
							$(this).addClass("mine");
							$(this).addClass("dead");
							//reveal all mines
							revealAllMines();
							//to-do: handle new game after game ends
							alert("You hit a mine X-(\nBetter luck next time ...\nGame time: "+addZerosToNumber(stopwatchMinutes,2) + ":" + addZerosToNumber(stopwatchSeconds,2));
							settings.CustomVars.DataSend({"cols":settings.cols,"rows":settings.rows,"mines":settings.mines,"difficulty":settings.difficulty,"time":addZerosToNumber(stopwatchMinutes,2),"username":settings.CustomVars.username});

							var highScores = getHighScores();
							//displayHighScores(highScores);
							return false;
						}
						else if (mines == 0){
							revealSafeCells(this);
							// reveal all safe cells connected to the current one
						}
						else { // for cells that are not safe add a number and class
							$(this).addClass("mines"+mines);
							$(this).html(mines);
						}
						checkVictory(); // Check if player won
						round++;
					}
				}
				else {
					alert("press [new game] for a new game :-)");
				}
			});
			matrix[y][x] = cell;
			row.append( cell );
			cells++;
		}
		$(field).append( row );
	}
	$(container).append( field );
	$(container).addClass("minesweeper-board");
	log("Board rendering completed. Total cells rendered: " + cells);
	log(matrix);
}

/* Check for mines on the current cell and on neighbouring cells
* returns true when the current cell is a mine
* when the current cell is safe returns number of mines on neighbouring cells
* whatch out for true != 1
*/  
function mineCheck(cell) {
	var x = $(cell).data("x")*1;
	var y = $(cell).data("y")*1;

	log( "mine check commenced at x: " + x + " y: " + y );
	
	// check for mine on the current cell
	if( $(cell).data("mine") == true ){
		log( "mine at " + x + "x" + y + "!", "warn" );
		return true;
	}
	
	var neighbourhood = [ 
		[x-1,y-1],
		[x,y-1],
		[x+1,y-1],
		[x-1,y],
		[x+1,y],
		[x-1,y+1],
		[x,y+1],
		[x+1,y+1]
	]; // coordinates of neighbouring cells
	
	var mines = 0;
	// Check neighbourhood for mines
	for (nCell in neighbourhood ) {
		var x = neighbourhood[nCell][0] // overrides previous variable
		var y = neighbourhood[nCell][1] // overrides previous variable
		// check if x and y are within existing range
		// check if neighboring cell is a mine
		if ( x >= 0 && x < settings.cols && y >= 0 && y < settings.rows && $(matrix[y][x]).data("mine") == true ){
			mines++;
		}
	}
	log( "found " + mines + " mines nearby" );
	return mines;
}

// function reveals all mines when player looses and shows flagged and non-flagged mines
function revealAllMines(){
	for (mY in matrix ) {
		for (mX in matrix[mY] ) {
			if ( $(matrix[mY][mX]).data("mine") == true ) {
				$(matrix[mY][mX]).addClass("mine");
				$(matrix[mY][mX]).addClass("revealed");
			}
		}
	}
}

// reveal all cells that are next to safe cells that are connected to the original safe cell and are not already revealed
function revealSafeCells(cell) {
	var x = $(cell).data("x")*1;
	var y = $(cell).data("y")*1;
	var neighbourhood = [ 
		[x-1,y-1],
		[x,y-1],
		[x+1,y-1],
		[x-1,y],
		[x+1,y],
		[x-1,y+1],
		[x,y+1],
		[x+1,y+1]
	]; // coordinates of neighbouring cells
	
	for (nCell in neighbourhood ) {
		var x = neighbourhood[nCell][0] // overrides previous variable
		var y = neighbourhood[nCell][1] // overrides previous variable

		/* check if x and y are within existing range
		 * check if cell is not already revealed
		 * check if cell is not flagged
		 * than reveal it
		 */
		if ( x >= 0 && x < settings.cols && y >= 0 && y < settings.rows && ( $(matrix[y][x]).hasClass("revealed") == false) && ( $(matrix[y][x]).hasClass("flag") == false) ){
			$(matrix[y][x]).addClass("revealed");
			$(matrix[y][x]).unbind("click");
			
			var mines = mineCheck(matrix[y][x]);
			
			if ( mines == 0 ) {
				revealSafeCells( matrix[y][x] );
			}
			else {
				$(matrix[y][x]).addClass("mines"+mines);
				$(matrix[y][x]).html(mines);
			}
		}
	}
}

/* Distributes mines on the field
 * optional avoidX and avoidY are used to make sure player will not step on a mine in the first round
*/
function layMines(avoidX, avoidY) {
	var mines = 0;
	var loopbreaker = 0;
	logGroup("mine laying"); // groups mine laying attempts into a group
	while ( mines < settings.mines && loopbreaker < 10000 ) {
		cX = Math.floor(Math.random() * settings.cols + 1)-1;
		cY = Math.floor(Math.random() * settings.rows + 1)-1;
		
		log(cX + "x" + cY + "(avoid " + avoidX + "x" + avoidY + ") : " + ( $(matrix[cY][cX]).data("mine") != true ) + " | " + ( (cX != avoidX) || (cY != avoidY) ) );
		

		if( $(matrix[cY][cX]).data("mine") != true && ( (cX != avoidX) || (cY != avoidY) ) ){
			$(matrix[cY][cX]).data("mine", true) ;
			log("mine set at " + cX + "x" + cY );
			mines++;
		}
		loopbreaker++;
	}
	if (loopbreaker >= 1000) {
		log("layMines error. Maximum number of iterations reached","error");
	}
	logGroup("end"); // end of the console group
	log(mines + " mines laid, armed and ready! Mine density " + Math.round( mines / ( settings.cols * settings.rows) * 100 ) / 100 + " mines per square");
} 

// function saves given high scores into local storage if possible
function saveHighScores(highScores){
	if (typeof(localStorage) != "undefined" )
	{
		log("local storage is available.  Saving high scores ...");
		try {
			localStorage.setItem("minesweeperHighScores", highScores.join("|") ); //saves to the local storage
			log("high score saved into local storage successfully");
			return true;
		}
		catch (e) {
			log("Localstorage error!\nHigh scores NOT saved!", "error"); //data wasn’t successfully saved
			log(e, "error");
		}
	}
	return false;
}

// function loads high scores from local storage if possible
function getHighScores(){
	var highScores = [];
	if (typeof(localStorage) != "undefined" ) {
		log("local storage is available. Loading high scores ...");
		try {
			if ( localStorage.getItem("minesweeperHighScores" ) ){
				var raw = localStorage.getItem("minesweeperHighScores" )
				highScores = raw.split("|");
				log("high scores loaded successfuly from local storage");
			}
			else {
				log("no previously saved high scores in localstorage");
			}
			return highScores;
		}
		catch (e) {
			log("Localstorage error! High scores NOT loaded!", "error"); 
			log(e, "error"); 
		}
	}
	return highScores
}

// function clears board and displays given high scores in a table in container
function displayHighScores(highScores)
{
	//Sort high scores by difficulty by time ascending
	highScores.sort( function(a,b){
		var diffA = a[1].toLowerCase();
		var diffB = b[1].toLowerCase();
		var gtA = parseInt(a[5]);
		var gtB = parseInt(b[5]);
		if (diffA < diffB) { //sort string ascending
  		return -1;
  	}
 		if (diffA > diffB) { 
  		return 1;
  	}
  	//if diffA == diffB
  	if (gtA < gtB){ 
  		return -1;
  	}
  	if (gtA > gtB){
  		return 1;
  	}
 		return 0; //default return value (no sorting)
	} );
	$(container).find(".minesweeper-board").remove();
	var highScoresBoard = '<table class="minesweeper-high-scores">' + "\n";
	highScoresBoard += '<caption>High Scores</caption>' + "\n";
	highScoresBoard += '<thead><tr><th>Player</th><th>Difficulty</th><th>Rows</th><th>Cols</th><th>Mines</th><th>Game time</th></tr><thead>' + "\n";
	highScoresBoard += '<tbody>' + "\n";
	for (var i in highScores ){
		var item = highScores[i].split(";")
		highScoresBoard += '<tr><td>' + item[0] + '</td><td>' + item[1] + '</td><td>' + item[2] + '</td><td>' + item[3] + '</td><td>' + item[4] + '</td><td>' + item[5] + '</td></tr>' + "\n";
	}
	highScoresBoard += '</tbody>' + "\n";
	highScoresBoard += '</table>' + "\n"; 
	$(container).prepend(highScoresBoard);
}

/* function checks victory: if number of revealed cells matches total number of cells minus number of mines.
 * therefor it is not necesary to flag all mines, just to reveal all cells with nomines (and not step on any mines in the process)
 */  
function checkVictory(){
	if( $(container).find(".revealed").length == settings.cols*settings.rows - settings.mines ) {
		clearTimeout(stopwatchInterval); // stop stopwatch
		//remove all click events
		revealAllMines();
		var allCells = $(container).find(".row div");
		$(allCells).unbind("click");
		$(allCells).unbind("contextmenu");
		
		//save high scores
		var gameTime = addZerosToNumber(stopwatchMinutes,2) + ":" + addZerosToNumber(stopwatchSeconds,2);
		var name = alert("Congratulation! You have found all the mines. :-)\nGame time: " + gameTime );
		settings.CustomVars.DataSend({"cols":settings.cols,"rows":settings.rows,"mines":settings.mines,"difficulty":settings.difficulty,"time":addZerosToNumber(stopwatchMinutes,2),"username":settings.CustomVars.username});
		
		var highScores = getHighScores();
		
		if (name != "" && name != undefined){
			highScores.push(name + ";" + settings.difficulty + ";" + settings.cols + ";" + settings.rows + ";" + settings.mines + ";" + gameTime);
			saveHighScores(highScores);
		}
		
		displayHighScores(highScores);
		
		return true;
	}
	return false;
}

/* function updates given object depending on the type of object
 * supported object variables: stopwatch, minesLeft
 */
function update(object){
	switch (object){
		case minesLeft:
			$(minesLeft).children("span").html( settings.mines*1 - ( $(container).find(".flag").length ) );
			break;
		default :
			log("got unknown object at update(object)", "error");
			log(object, "error");
	}
}

// function cleans matrix and container from previous game before reinitialization 
function cleanup(){
	// flush mines from matrix
	for (mY in matrix ) {
		for (mX in matrix[mY] ) {
			$(matrix[mY][mX]).data("mine",false);
		}
	}
	clearTimeout(stopwatchInterval); // clear stopwatch
	$(container).html(""); // clear container
}

//Sets up game variables, sets up board and lays mines
function init() {
	matrix = new Array();
	gameFinished = false;
	round = 1;
	foundMines = 0;
	stopwatchInterval = false;
	stopwatchMinutes = 0;
	stopwatchSeconds = 0;

	renderBoard(); // render playing board
	layMines(); // distribute mines

	var panel = $("<div></div>");
	$(panel).addClass("panel");
	//render status bar
	statusBar = $("<div></div>");
	$(statusBar).addClass("status-bar");
	//render stopwatch
	stopwatch = $("<div></div>");
	$(stopwatch).addClass("stopwatch");
	$(stopwatch).html("<span>00:00</span>");
	//render mines left
	minesLeft = $("<div></div>");
	$(minesLeft).addClass("mines-left");
	$(minesLeft).attr("title","Mines left");
	$(minesLeft).html("<span>" + settings.mines + "</span>");
	//render flag button
	flagButton = $("<div></div>");
	$(flagButton).addClass("flag-button");
	$(flagButton).attr("title","Toggle flagging mines");
	$(flagButton).click( function(){
		$(this).toggleClass("pressed");
	} );
	$(flagButton).html("<span>&nbsp;</span>");
	//render new game button
	var newGame = $("<div></div>");
	$(newGame).addClass("new-game");
	$(newGame).html("<span>New game</span>");
	$(newGame).attr("title","Close current game and start a new one");
	$(newGame).click( function(){
		cleanup();
		renderMenu()
	} );
	//pause
	var pause = $("<div></div>");
	$(pause).addClass("pause");
	$(pause).attr("title","Pause game");
	$(pause).click( function(){
		//handle pause
	} );
	//assemble panel
	$(panel).append( $(flagButton) );
	$(panel).append( $(minesLeft) );
	$(panel).append( $(stopwatch) );
	$(panel).append(newGame);
	//$(panel).append(pause);
	//$(panel).append(statusBar);
	$(container).append( $(panel) );
	
	//Game started
	var d = new Date();
	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();

	log("Game begun " + addZerosToNumber(curr_hour,2) + ":" + addZerosToNumber(curr_min,2) + "");
}

// adds zeros in front of the number(nr) until reaches total number of characters(count) 
function addZerosToNumber(nr,count){
	var string = nr + "";
	while (string.length < count){
		string = "0" + string;
	}
	return string;
}

// Logs to firebug console if available and if debug: true
function log(message,type){
	if (typeof console != "undefined" && typeof console.log != "undefined" &&settings.debug == true){
		switch(type){
			case undefined:
				console.log(message);
				break;
			case "error":
				console.error(message);
				break;
			case "warn":
				console.warn(message);
				break;
			default:
				return false;
		}
	}
	return false;
}

// Handles log groups with firebug console if available and if debug: true
function logGroup(group){
	if (typeof console != "undefined" && typeof console.group != "undefined" &&settings.debug == true){
		switch(group){
			case "end":
				console.groupEnd();
				break;
			default:
				console.group(group);
		}
	}
	return false;
}

	}
})(jQuery);
// End of Minesweeper plugin