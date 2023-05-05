class Team {
    constructor(teamId, playerName, catList, colorArray) {
        this.id = teamId;
        this.playerName = playerName;
        this.cats = [];
        this.color = colorArray;

        let unplacedIndex = 0;
        for (let i = 0; i < catList.length; i++) {
            this.cats[i] = new Cat(catList[i], GameInfo.images.cats[catList[i].type - 1], false);
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
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].update(catList[i], false);
        }
    }
}