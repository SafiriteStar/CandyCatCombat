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

    constructor(teamId, playerName, catList, colorArray) {
        this.id = teamId;
        this.playerName = playerName;
        this.cats = [];
        this.color = colorArray;

        let unplacedIndex = 0;
        for (let i = 0; i < catList.length; i++) {
            this.cats[i] = new Cat(catList[i], Team.getCatImage(catList[i].type - 1), false);
        }
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

    draw() {
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].draw(this.color);
        }
    }

    update(catList) {
        // Update all the info
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].update(catList[i], false);
        }
    }

    updateFace(opponentList) {
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].updateFace(opponentList);
        }
    }
}