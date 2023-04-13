class MapSelector {
    constructor() {
        // Tile
        this.posX = null;
        this.posY = null;
        this.coordX = null;
        this.coordY = null;

        // Cat
        this.team = null;
        this.cat = null; // An index for the team

        // Map
        this.map = null;

        // Tile Info Box
        this.tileInfoBox = new TileInfoBox();
    
        // Cat Info Box
        this.catInfoBox = new CatInfoBox();

        // Range indicator
        this.rangeIndicator = new RangeHighlighter(true, [230, 30, 30]);
        this.moveIndicator = new RangeHighlighter(false, [164, 149, 255]);
    }

    drawIndicators() {
        this.rangeIndicator.draw();
        this.moveIndicator.draw();
    }

    draw() {
        push();
            stroke(255, 255, 0, 150);
            Tile.drawSimpleTile(this.posX, this.posY);
        pop();
        this.drawIndicators();  
    }

    drawInfoBoxes() {
        if (this.map !== null) {
            this.tileInfoBox.draw();
        }

        if (this.cat !== null) {
            this.catInfoBox.draw();
        }
    }

    #getCatAtTile(coordX, coordY, map) {
        let team = null;
        let cat  = null;
        // For every team
        for (let i = 0; i < GameInfo.world.teams.length; i++) {
            // Try and get a cat
            cat = GameInfo.world.teams[i].getCatAtCoord(coordX, coordY, map);
            if (cat !== null && cat !== undefined && ((map < 1 && i === 0) || map > 0)) {
                team = i;
                // We have a cat and a team, return them
                return [team, cat]
            }
            else {
                let team = null;
            }
        }
        return [team, cat]
    }

    updateRangeIndicators(selectedCatData) {
        this.rangeIndicator.newSource(selectedCatData, selectedCatData.min_range, selectedCatData.max_range);
        // CHANGE TO SPEED AFTER
        this.moveIndicator.newSource(selectedCatData, 1, selectedCatData.speed);
    }
    
    update(posX, posY, coordX, coordY, map) {
        this.posX = posX;
        this.posY = posY;
        this.coordX = coordX;
        this.coordY = coordY;
        this.map = map;
        
        // If we are on a map
        if (this.coordX !== null && this.coordY != null && this.map != null) {
            
            this.tileInfoBox.update(GameInfo.world.maps[this.map].getTile(this.coordX, this.coordY), this.map);

            // Try and see who is in the tile
            let [newTeam, newCat] = this.#getCatAtTile(this.coordX, this.coordY, this.map);
            
            // If there is a cat in the new tile
            if (newTeam !== null && newCat !== null) {
                // Set the current cat to the new one
                this.team = newTeam;
                this.cat = newCat;
                // Update our indicators
                this.catInfoBox.update(this.cat, this.team);
                this.updateRangeIndicators(GameInfo.world.teams[this.team].cats[this.cat]);
            }
            else {
                // There was no cat in that tile
                // Do we have a player cat?
                if (this.team == 0) {
                    // We do
                    // Lets try to move to the tile we just clicked
                    moveCatAction(this.coordX, this.coordY, this.map, GameInfo.world.teams[this.team].cats[this.cat].id, GameInfo.world.teams[this.team].id);
                }
                // Do we have *a* cat?
                else if (this.team) {
                    // We do, lets set it to null
                    this.cat = null;
                    this.team = null;
                }
            }
        }
        else {
            // We are not on a map, clear cat info
            this.cat = null;
            this.team = null;
        }
    }
}