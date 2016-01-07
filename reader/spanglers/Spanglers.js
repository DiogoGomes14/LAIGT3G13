/**
 * Each piece can be one of 4 values: 2, up for player 1 ; 3, down for player 1; 4, up for player 2, and 5, down for player 2
 * the 0 and 1 values are for ghost pieces for up and down positions. They are used to correctly display the board in
 * sicstus but are not used here. The values 6 and 7 are only used for setting the color and orientation of the
 * pickable pieces
 * @param scene
 * @constructor
 */

var completedRequest = false;
var completedRequestData = false;
var completedRequestType = false;

function Spangles(scene) {
    this.scene = scene;

    this.plays = [];

    //initial board
    this.board = [[2]];

    this.objects = []; //array of pieces for each player
    this.pickableObjects = []; //array of pickable pieces

    //list of players and active player
    this.players = {p1: 'p1', p2: 'pc', active: 'pc'};

    //number of pieces left for each player
    this.pieces = [24, 25];

    //can be 0 or 1, 1 being the harder
    this.difficulty = 0;

    //use the this.board to initialize the pieces
    this.setPiecesFromBoard();

    //initialize the history of the game (board + invertPickPieces flag)
    this.boardHistory = [];

    //flag to change the orientation of the pickable pieces when there is a shift in the position
    this.invertPickPieces = false;

    //flag that says if the game is over or not
    this.gameOver = false;
}

/**
 * terminate connection with SICSTUS
 */
Spangles.prototype.terminateConnection = function () {
    getPrologRequest("quit");
};

/**
 * Asks the game logic if the current player has a move that wins the game
 */
Spangles.prototype.requestWinCheck = function () {
    var message = "";
    if(this.players.active == this.players.p1){
        message = "check_win("
            + this.printBoard() + ","
            + this.players.p1 + ","
            + this.players.p2 + ","
            + this.board[0].length + ","
            + this.pieces[0] + ","
            + this.pieces[1] + ","
            + this.difficulty + ")";
    } else {
        message = "check_win("
            + this.printBoard() + ","
            + this.players.p2 + ","
            + this.players.p1 + ","
            + this.board[0].length + ","
            + this.pieces[0] + ","
            + this.pieces[1] + ","
            + this.difficulty + ")";
    }

    console.log("Sending " + message);

    makeRequest(message,
        function (data) {
            completedRequestData = data.target.response;
            completedRequestType = "win";
            completedRequest = true;
        }
    );
};

/**
 * Asks the game logic for the available plays with the current board
 */
Spangles.prototype.requestAvailablePlays = function () {
    var message = "available_plays_cmd("
        + this.printBoard() + ","
        + this.board[0].length + ")";

    console.log("Sending " + message);
    makeRequest(message,
        function (data) {
            completedRequestData = data.target.response;
            completedRequestType = "available";
            completedRequest = true;
        }
    );
};

/**
 * Asks the game logic for the board state after making a play in a certain position
 */
Spangles.prototype.requestMakePlay = function (row, column) {
    var message = "play_cmd("
        + this.printBoard() + ","
        + this.players.active + ","
        + row + ","
        + column + ")";

    console.log("Sending " + message);

    makeRequest(message,
        function (data) {
            completedRequestData = data.target.response;
            completedRequestType = "play";
            completedRequest = true;
        }
    );
};

/**
 * adds a piece to the objects
 * @param x
 * @param z
 * @param piece number of the piece that comes from the game logic
 */
Spangles.prototype.addPiece = function (x, z, piece) {
    this.objects.push(new Piece(this.scene, x, z, piece));
};

/**
 * adds a piece to the pickable Objects
 * @param x
 * @param z
 * @param piece special number 6 or 7 that states the orientation of this pickable piece
 */
Spangles.prototype.addPickablePiece = function (x, z, piece) {
    this.pickableObjects.push(new Piece(this.scene, x, z, piece));
};

/**
 * initialize the pickable pieces with the array of available plays
 */
Spangles.prototype.setPickablePieces = function () {
    this.pickableObjects = [];
    for (var i = 0; i < this.plays.length; i++) {
        if ((this.plays[i][0] + this.plays[i][1]) % 2 == 1)
            this.addPickablePiece(this.plays[i][0], this.plays[i][1], !this.invertPickPieces ? 7 : 6);
        else
            this.addPickablePiece(this.plays[i][0], this.plays[i][1], this.invertPickPieces ? 7 : 6);
    }
};

/**
 * initialize the pieces from the current board state
 */
Spangles.prototype.setPiecesFromBoard = function () {
    this.objects = [];
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[i].length; j++) {
            if (this.board[i][j] == 2 || this.board[i][j] == 4) {
                this.addPiece(i + 1, j + 1, this.board[i][j]);
            } else if (this.board[i][j] == 3 || this.board[i][j] == 5) {
                this.addPiece(i + 1, j + 1, this.board[i][j]);
            }
        }
    }
};

/**
 * takes the input string from the game logic and sets the current available pieces
 * @param dataString data that came from the logic
 */
Spangles.prototype.setPlays = function (dataString) {
    var spliced = dataString.match(/\d+/g);

    var plays = [];

    for (var i = 0; i < spliced.length; i++, i++) {
        plays.push([parseInt(spliced[i]), parseInt(spliced[i + 1])]);
    }

    this.plays = plays;

};

/**
 * takes the input string from the game logic and sets the current board
 * @param dataString data that came from the logic
 */
Spangles.prototype.setBoard = function (dataString) {
    var spliced = dataString.match(/(\d+|\[|]|,)/g);
    if (spliced == null || dataString.indexOf("_") != -1) {
        console.error("Invalid board received");
        return;
    }

    var a = 0;

    var board = [];

    for (var i = 1; i < spliced.length - 1; i++) {
        switch (spliced[i]) {
            case "[":
                board.push([]);
                break;
            case "]":
                a++;
                break;
            case ",":
                break;
            default:
                board[a].push(parseInt(spliced[i]));
                break;
        }
    }

    this.board = board;
};

/**
 * takes the input string from the game logic and checks if a player won
 * @param dataString data that came from the logic
 */
Spangles.prototype.checkIfWin = function (dataString) {
    switch (dataString.substring(1, dataString.length - 1)) {
        case "Player 1 wins.":
            return 1;
        case "PC wins.":
            return 2;
        case "Player 1 has run out of moves!":
            return 3;
        case "PC has run out of moves!":
            return 4;
        case "Both players have run out of moves! Game ends in draw.":
            return 5;
        case "Continue":
            return 0;
        default:
            return -1;
    }
};

/**
 * decreases the number of pieces that a certain player has
 * @param playerName
 */
Spangles.prototype.decreaseNPieces = function (playerName) {
    if (playerName == 'p1')
        this.pieces[0]--;
    else
        this.pieces[1]--;
};

/**
 * increases the number of pieces that a certain player has
 * @param playerName
 */
Spangles.prototype.increaseNPieces = function (playerName) {
    if (playerName == 'p1')
        this.pieces[0]++;
    else
        this.pieces[1]++;
};

/**
 * add the current state to the history
 */
Spangles.prototype.addHistory = function () {
    this.boardHistory.push({
        'board': this.printBoard(),
        'invertPickPieces' : this.invertPickPieces
    });
};

/**
 * change the current state to the last one
 */
Spangles.prototype.undoMove = function () {
    var last = this.boardHistory.pop();
    this.increaseNPieces(this.players.active);

    this.setBoard(last.board);


    this.switchPlayerTurn();

    this.setPiecesFromBoard();
    this.invertPickPieces = last.invertPickPieces;
    this.requestAvailablePlays();
};

/**
 * Makes a play for a certain position that was picked from the available plays
 * @param piece
 */
Spangles.prototype.pickPiece = function (piece) {
    var z = piece.x + 1;
    var x = piece.z + 1;

    if (z == 0 || x == 0) {
        this.switchPickablePiecesOrientation();
    }

    this.requestMakePlay(x, z);
};

/**
 * Switch the pickable pieces orientation
 */
Spangles.prototype.switchPickablePiecesOrientation = function () {
    this.invertPickPieces = !this.invertPickPieces;
};

/**
 * Switch the current player to the other one
 */
Spangles.prototype.switchPlayerTurn = function () {
    if (this.players.active == this.players.p1) {
        this.players.active = this.players.p2;
    } else {
        this.players.active = this.players.p1;
    }
};

/**
 * Format the board in a specific format to send to the game logic part
 * @returns {string}
 */
Spangles.prototype.printBoard = function () {
    var stringStream = "[";
    for (var i = 0; i < this.board.length; i++) {
        stringStream += "[";
        for (var j = 0; j < this.board[i].length - 1; j++) {
            stringStream += this.board[i][j] + ",";
        }
        stringStream += this.board[i][j] + "]";
        if (i != this.board.length - 1) {
            stringStream += ",";
        }
    }
    stringStream += "]";
    return stringStream;
};

/**
 * displays the pieces from the board and the pickable pieces
 */
Spangles.prototype.display = function () {
    for (var i = 0; i < this.objects.length; i++) {
        this.scene.pushMatrix();

        //this.scene.registerForPick(i + 1, this.objects[i]);

        this.objects[i].display();

        this.scene.popMatrix();
    }

    for (var j = 0; j < this.pickableObjects.length; j++) {
        this.scene.pushMatrix();

        this.scene.registerForPick(j + 1, this.pickableObjects[j]);

        this.pickableObjects[j].display();

        this.scene.popMatrix();
    }
};

/**
 * process the game after a request is received
 */
Spangles.prototype.processGame = function () {
    if(completedRequest){
        if(!completedRequestData){
            console.error("Request happened but there is no data")
        }

        if(completedRequestData == "Bad Request"){
            return;
        }

        switch (completedRequestType){
            case "play":
                this.addHistory();
                this.setBoard(completedRequestData);
                this.setPiecesFromBoard();
                this.decreaseNPieces(this.players.active);

                this.requestWinCheck();

                this.switchPlayerTurn();
                this.requestAvailablePlays();
                break;
            case "available":
                this.setPlays(completedRequestData);
                this.setPickablePieces();
                break;
            case "win":
                if(this.checkIfWin(completedRequestData) > 0){
                    this.gameOver = true;
                }
                break;
            default:
                console.error("Request happened but there is no type for it")
        }

        completedRequest = false;
        completedRequestData = false;
        completedRequestType = false;
    }
};

/**
 * displays the winner text
 */
Spangles.prototype.displayEndText = function () {


    // activate texture containing the font
    this.scene.appearance.apply();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -10);

    this.scene.scale(0.1, 0.1, 0.1);

    // set character to display to be in the 6th column, 5th line (0-based)
    // the shader will take care of computing the correct texture coordinates
    // of that character inside the font texture (check shaders/font.vert )
    // Homework: This should be wrapped in a function/class for displaying a full string

    this.scene.activeShader.setUniformsValues({'charCoords': [0, 5]});
    this.scene.plane.display();

    this.scene.translate(1, 0, 0);
    if(this.players.active == this.players.p2){
        this.scene.activeShader.setUniformsValues({'charCoords': [1, 3]});
    } else {
        this.scene.activeShader.setUniformsValues({'charCoords': [2, 3]});
    }
    this.scene.plane.display();

    this.scene.translate(1, 0, 0);
    this.scene.activeShader.setUniformsValues({'charCoords': [7, 5]});
    this.scene.plane.display();

    this.scene.translate(1, 0, 0);
    this.scene.activeShader.setUniformsValues({'charCoords': [9, 4]});
    this.scene.plane.display();

    this.scene.translate(1, 0, 0);
    this.scene.activeShader.setUniformsValues({'charCoords': [14, 4]});
    this.scene.plane.display();

    this.scene.popMatrix();
};


