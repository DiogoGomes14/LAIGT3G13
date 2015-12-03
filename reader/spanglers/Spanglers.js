function Spangles() {
    this.board = [[2]];
    this.players = {'p1': 'p1', p2: 'p2', 'active': 'p1'};
    this.pieces = [25, 25];
}

Spangles.property.init = function (difficulty, gameType, player1, player2) {
    this.difficulty = difficulty;
    this.gameType = gameType;
};

Spangles.property.initPlayerVsPlayer = function () {
    this.gameType = 'pp';
    this.player1 = 'p1';
    this.player2 = 'p2';

    var response = makeRequest('initPlayerVsPlayer');

    if (response != 'Bad Request') {
        return response;
    } else {

    }
};