const pool = require("../config/database");
class Board {
    static width = 21;
    static height = 35;

    // The wall array holds coordinate arrays inside:
    // E.g
    //      [
    //          [2, 5],
    //          [5, 7],
    //          [1, 9]
    //      ]
    constructor(wallArray) {
        // Initialize the board 2D array
        this.map = [];
        for (let i = 0; i  < width; ++i) {
            map[i] = []
            for (let j = 0; j < height; ++j) {
                // 0 means empty space, 1 will mean wall
                map[i][j] = 0;
            }
        };

        // Hex map connections:
        // A tile is connected to the top 2 hexes by:
        //      x -> x,     y -> y + 1
        //      x -> x + 1, y -> y + 1
        // A tile is connected to the side hexes by:
        //      x -> x + 1, y -> y
        //      x -> x - 1, y -> y
        // A tile is connected to the bottom 2 hexes by:
        //      x -> x,     y -> y - 1
        //      x -> x + 1, y -> y - 1
        
        // TODO: Add walls after using the given wallArray
        for (let i = 0; i  < wallArray.length(); ++i) {
            // Given the coordinate in wall array, set that hex to a wall
            map[wallArray[i][1], wallArray[i][2]] = 1;
        };

    }

    exports() {
        let board = new Board();
        board.map = this.map;

        return board;
    }

    static async getBoard(game) {
        try {
            let board = new Board([]);
            // TODO: Ask database for character positions
            // Append the characters to board
            return { status: 200, result: board}
        } catch (err) {
            console.log(err);
            return {status: 500, result: err };
        }
    }
}

module.exports = Board