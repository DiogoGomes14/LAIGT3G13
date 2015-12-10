function Spangles() {
    //initial board
    this.board = [[2]];

    //list of players and active player
    this.players = {'p1': 'p1', p2: 'p2', 'active': 'p1'};

    //number of pieces left for each player
    this.pieces = [25, 25];

    //can be 0 or 1, 1 being the harder
    this.difficulty = 0;
}

Spangles.prototype.init = function (difficulty, gameType) {
    this.difficulty = difficulty;
    this.gameType = gameType;
};

Spangles.prototype.initPlayerVsPlayer = function () {
    var response = makeRequest('initPlayerVsPlayer');

    if (response != 'Bad Request') {
        return response;
    } else {

    }
};

Spangles.prototype.checkConnection = function () {
    return getPrologRequest("hello") == "greetings";
};

Spangles.prototype.terminateConnection = function () {
    return getPrologRequest("quit") == "goodbye";
};

Spangles.prototype.checkWin = function () {
    //TODO check if inputs are correct
    var res = makeRequest(
        "check_win("
        + this.printBoard() + ","
        + this.players.p1 + ","
        + this.players.p2 + ","
        + this.board[0].length + "," //TODO check correctness
        + this.pieces[0] + ","
        + this.pieces[1] + ","
        + this.difficulty + ")"
    );
};

Spangles.prototype.getAvailablePlays = function () {
    //TODO check if inputs are correct
    var res = makeRequest(
        "available_plays_cmd("
        + this.printBoard() + ","
        + this.board[0].length + ")" //TODO check correctness
    );

    return res;
};

Spangles.prototype.printBoard = function(){
    var stringStream = "[";
    for(var i = 0; i < this.board.length; i++){
        stringStream += "[";
        for(var j = 0; j < this.board[i].length - 1; j++){
            stringStream += this.board[i][j] + ",";
        }
        stringStream += this.board[i][j] + "]";
    }
    stringStream += "]";
    return stringStream;
};

Spangles.prototype.makePlay = function (row, column) {
    //TODO check if inputs are correct
    var res = makeRequest(
        "play_cmd("
        + this.printBoard() + ","
        + this.players.active + ","
        + row + ","
        + column + ")"
    );
};