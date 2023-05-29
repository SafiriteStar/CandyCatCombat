class Team {
    static getCatImage(catIndex) {
        let catImageTable = [
            GameInfo.images.cats.vanillaCat,
            GameInfo.images.cats.candyCornCat,
            GameInfo.images.cats.mawbreakerCat,
            GameInfo.images.cats.gumCat,
            GameInfo.images.cats.popCat,
            GameInfo.images.cats.caramelCat,
            GameInfo.images.cats.chocoDairyMilkCat,
        ]

        return catImageTable[catIndex];
    }

    constructor(teamId, playerName, catList, caramelWalls, colorArray) {
        this.id = teamId;
        this.playerName = playerName;
        this.cats = [];
        this.color = colorArray;

        this.caramelWalls = [];
        for (let i = 0; i < caramelWalls.length; i++) {
            this.caramelWalls.push(new Tile(caramelWalls[i]));
        }

        let unplacedIndex = 0;
        for (let i = 0; i < catList.length; i++) {
            this.cats[i] = new Cat(catList[i], Team.getCatImage(catList[i].type - 1), false);
        }

        this.attackRange = new RangeHighlighter(true, true, [230, 30, 30, 0], [230, 130, 120, 0], 1);
    }
    
    // Returns true if it finds unplaced player cats, false if not
    unplacedCatsCheck() {
        for (let i = 0; i < this.cats.length; i++) {
            if (this.cats[i].map === 0) {
                return true;
            }
        }

        return false;
    }

    getLiveCats() {
        let liveCats = [];

        for (let i = 0; i < this.cats.length; i++) {
            if (this.cats[i].current_health > 0) {
                liveCats.push(this.cats[i]);
            }
        }

        return liveCats;
    }

    // Returns the index
    getCatAtCoord(x, y, map) {
        for (let i = 0; i < this.cats.length; i++) {
            if (this.cats[i].x == x && this.cats[i].y == y && this.cats[i].map == map && this.cats[i].current_health > 0) {
                return i;
            }
            
        }

        return null;
    }

    checkCaramelTile(x, y, map) {
        for (let i = 0; i < this.caramelWalls.length; i++) {
            if (this.caramelWalls[i].x == x && this.caramelWalls[i].y == y && this.caramelWalls[i].map == map) {
                return true;
            }
        }

        return false;
    }

    attack() {
        for (let i = 0; i < this.cats.length; i++) {
            this.attackRange.newSource(this.cats[i], this.cats[i].min_range, this.cats[i].max_range);
            let opponentCats = this.attackRange.checkForOpponentCats();
            if (opponentCats.length > 0) {
                this.cats[i].catAnimations.changeState("attack");
            }
        }
    }

    draw() {        
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].draw(this.color);
        }
    }

    drawCaramelTiles() {
        push();
        fill('burlywood');
        for (let i = 0; i < this.caramelWalls.length; i++) {
            push();
            translate(this.caramelWalls[i].screenX, this.caramelWalls[i].screenY);
            tint(255, 255, 255, 125);
            image(GameInfo.images.tiles.caramel, -GameInfo.images.tiles.caramel.width * 0.5, -GameInfo.images.tiles.caramel.height * 0.5);
            //Tile.drawSimpleTile(this.caramelWalls[i].screenX, this.caramelWalls[i].screenY)
            pop();
        }
        pop();
    }

    update(catList, caramelWalls) {
        // Update all the info
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].update(catList[i], false);
        }

        this.caramelWalls = [];
        for (let i = 0; i < caramelWalls.length; i++) {
            this.caramelWalls.push(new Tile(caramelWalls[i]));
        }
    }

    updateFace(opponentList) {
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].updateFace(opponentList);
        }
    }
}