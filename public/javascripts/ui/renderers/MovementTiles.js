class MovementTile {
    constructor() {
        // 1D array that stores all tiles to color in
        this.movementTiles = [];
    }
    draw() {

    }

    update(centreX, centreY) {
        this.movementTiles[0] = {};
        this.movementTiles[0].x = centreX;
        this.movementTiles[0].y = centreY;
        
    }
}