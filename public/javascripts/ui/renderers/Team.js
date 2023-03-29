class Team {
    constructor(teamId, catList, colorArray) {
        this.id = teamId;
        this.cats = [];
        this.color = colorArray;

        for (let i = 0; i < catList.length; i++) {
            this.cats[i] = new Cat(catList[i], false);
        }
    }

    draw(xOffset, yOffset) {
        for (let i = 0; i < this.cats.length; i++) {
            this.cats[i].draw(xOffset, yOffset, this.color);
        }
    }
}