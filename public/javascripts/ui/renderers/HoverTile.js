class HoverTile {
    constructor() {
        this.posX = null;
        this.posY = null;
        this.coordX = null;
        this.coordY = null;
        this.map = null;
    }

    draw() {
        push();
            fill(0, 0, 0, 0);
            strokeWeight(24);
            stroke(255, 255, 255, 150);
            Tile.drawSimpleTile(this.posX, this.posY);
        pop();
    }
    
    updateCoord() {
        for (let i = 0; i < GameInfo.world.maps.length; i++) {
            // If we are in the placement map and all the cats are ready
            if (i === 0 && !GameInfo.world.teams[0].unplacedCatsCheck()) {
                // Then skip this loop
                break;
            }

            if (GameInfo.world.maps[i].checkPositionExists(this.posX, this.posY)) {
                [this.coordX, this.coordY] = GameInfo.world.maps[i].getPositionCoord(this.posX, this.posY);
                this.map = i;
                
                // We did all we came for after finding one map, so return after drawing
                this.draw();
                return;
            }
            else {
                this.coordX = null;
                this.coordY = null;
                this.map = null;
            }
        }
    }

    updatePos(posX, posY) {
        
        // If its not null and odd then
        if (posX !=null) {
            this.posX = (roundToNumber(posX, Tile.width * 1.5));


            if (isEven(this.posX)) {
                this.posY = (roundToNumber(posY + Tile.height, Tile.height * 2)) - Tile.height;
            }
            else {
                this.posY = (roundToNumber(posY, Tile.height * 2));
            }

            // When we update our position, also update our coordinates
            this.updateCoord();
        }
        else {
            this.posX == null;
            this.posY == null;
        }
    }
}