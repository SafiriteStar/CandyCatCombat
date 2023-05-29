class RangeHighlighter {

    constructor(ignoreWalls, ignoreAliveCats, fillColor, strokeColor, tileScale) {
        this.sourceCat = null; // An object with x and y
        this.sourceCatTeamIndex = null;
        this.tiles = [];
        this.tilesToHighlight = []; // We will store the tiles to highlight here
        this.ignoreWalls = ignoreWalls;
        this.ignoreAliveCats = ignoreAliveCats;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.tileScale = tileScale;
        this.map = null;
    }

    draw() {
        if (this.sourceCat) {
            let [redFill, greenFill, blueFill, alphaFill] = this.fillColor;
            let [redStroke, greenStroke, blueStroke, alphaStroke] = this.strokeColor;
            // For each tile in tiles, draw them
            this.tilesToHighlight.forEach(tile => {
                let cat = GameInfo.world.getCatAliveAtCoord(tile.x, tile.y, this.map);
                push();
                if ((!this.ignoreAliveCats && cat.length === 0) || this.ignoreAliveCats) {                    
                    translate(World.mapDrawOffsets[this.map][0], World.mapDrawOffsets[this.map][1]);
                    fill(redFill, greenFill, blueFill, alphaFill);
                    strokeWeight(24);
                    stroke(redStroke, greenStroke, blueStroke, alphaStroke);
                    push();
                    Tile.drawScaledTile(tile.screenX, tile.screenY, this.tileScale);
                    pop();
                    if (this.ignoreAliveCats) {
                        if (cat.length > 0 && GameInfo.world.getCatTeamIndex(cat[0]) !== this.sourceCatTeamIndex) {
                            // Found a cat of a different team
                            push();
                            translate(tile.screenX, tile.screenY);
                            scale(0.25);
                            image(GameInfo.images.ui.attackIcon, -GameInfo.images.ui.attackIcon.width * 0.5, -GameInfo.images.ui.attackIcon.height * 0.5);
                            pop();
                        }
                    }
                }
                pop();
            });
        }
    }

    neighborTileChecks(currentTile, newNeighbors, catAlive, catTeam) {
        // If its not in tiles or our new neighbor list
        if (this.tiles.includes(currentTile) || newNeighbors.includes(currentTile)) {
            return false;
        }

        // If we are not ignoring walls and it is a wall
        if (!this.ignoreWalls && currentTile.type == 2) {
            return false;
        }

        // If there is a cat on that tile and we aren't ignoring cats that are alive
        if (catAlive !== null && catAlive !== undefined && catTeam !== null && catTeam !== undefined && !this.ignoreAliveCats) {
            // Is that from a different team?
            if (!catTeam.cats.includes(this.sourceCat)) {
                // Yes
                return false;
            }
        }

        if (GameInfo.world.checkOtherTeamsCaramelTile(this.sourceCatTeamIndex, currentTile.x, currentTile.y, currentTile. map) && !this.ignoreWalls) {
            return false;
        }

        // We passed it all
        return true;
    }

    getNeighborTiles() {
        // Get a list of unvisited neighbor tiles
        let newNeighbors = [];
        
        // For each tile in tiles
        for (let i = 0; i < this.tiles.length; i++) {
            // For each neighbor that tile has
            for (let j = 0; j < this.tiles[i].connections.length; j++) {
                // Get the actual tile data
                let currentTile = GameInfo.world.getTileInMap(this.tiles[i].connections[j].x, this.tiles[i].connections[j].y, this.map);
                let [catAlive, catTeam] = GameInfo.world.getCatAliveAtCoord(this.tiles[i].connections[j].x, this.tiles[i].connections[j].y, this.map);
                
                if (this.neighborTileChecks(currentTile, newNeighbors, catAlive, catTeam)) {
                    // Add that neighbor
                    newNeighbors.push(currentTile);
                }
            }
            
        }
        
        // After all this we should essentially have a new ring of neighbors saved in newNeighbors
        return newNeighbors
    }

    newSource(sourceCat, minRange, maxRange) {
        // Set our cat
        this.sourceCat = sourceCat;
        // Clear the array
        this.tiles = [];
        // Lets also reset what tiles we are highlighting
        this.tilesToHighlight = [];

        // Wait did we just wipe who our cat was?
        if (this.sourceCat === null) {
            // Alright, erase everything
            this.map = null;
            this.sourceCatTeamIndex = null;
            // And get out
            return
        }

        // Update our map
        this.map = sourceCat.map;

        // What team are we on?
        this.sourceCatTeamIndex = GameInfo.world.getCatTeamIndex(this.sourceCat);

        // If we aren't in the placement map
        if (this.map !== 0) {
            // Add in the source tile to it
            this.tiles.push(GameInfo.world.getTileInMap(sourceCat.x, sourceCat.y, this.map));
        }

        // For the max range of our cat
        for (let i = 0; i < maxRange; i++) {
            // We want to get the neighbor tiles
            let newNeighbors = this.getNeighborTiles();
            // Add them to the total tiles list
            this.tiles = this.tiles.concat(newNeighbors);
            // And if we are at or above our minimum range, add them to the highlighted tiles as well
            if (minRange - 2 < i) {
                this.tilesToHighlight = this.tilesToHighlight.concat(newNeighbors);
            }
        }
    }

    checkForOpponentCats() {
        let sourceTeamIndex = GameInfo.world.getCatTeamIndex(this.sourceCat);
        
        let opponentCats = [];

        for (let i = 0; i < this.tilesToHighlight.length; i++) {
            let [cat] = GameInfo.world.getCatAliveAtCoord(this.tilesToHighlight[i].x, this.tilesToHighlight[i].y, this.map);
            if (cat !== null && cat !== undefined) {
                if (sourceTeamIndex !== GameInfo.world.getCatTeamIndex(cat)) {
                    // We found an opponent cat
                    opponentCats.push(cat);
                }
            }
        }

        return opponentCats;
    }
}