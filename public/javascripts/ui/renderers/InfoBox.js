class InfoBox {
    static backgroundColor = [200, 200, 200, 255];
    static strokeColor = [150, 150, 150, 255];
    static strokeWeight = 4;
    static radius = 5;
    static margin = 4;
    static textMargin = 4;

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.displayTextArray = [];
    }

    draw() {
        push()
            let [bgR, bgG, bgB, bgA] = InfoBox.backgroundColor
            fill(bgR, bgG, bgB, bgA);
            let [sR, sG, sB, sA] = InfoBox.strokeColor;
            stroke(sR, sG, sB, sA);
            strokeWeight(InfoBox.strokeWeight);
            rect(this.x, this.y, this.width, this.height, InfoBox.radius);
        pop();

        push();
            textAlign(LEFT, CENTER);
            textSize(16);
            textStyle(NORMAL);

            translate(InfoBox.textMargin, InfoBox.textMargin);
            for (let i = 0; i < this.displayTextArray.length; i++) {
                text(
                    this.displayTextArray[i],
                    this.x + InfoBox.textMargin,
                    this.y + ((this.height - (InfoBox.margin + InfoBox.strokeWeight)) * (1/this.displayTextArray.length) * i),
                    this.width - (InfoBox.textMargin + InfoBox.strokeWeight),
                    (this.height - (InfoBox.textMargin + InfoBox.strokeWeight)) * (1/this.displayTextArray.length)
                );
            }
        pop();
    }
}

class TileInfoBox extends InfoBox {
    static boxWidth = 100;
    static boxHeight = 50;

    constructor() {
        // Call InfoBox's constructor
        super(
            InfoBox.strokeWeight + InfoBox.margin,
            GameInfo.height - (TileInfoBox.boxHeight + InfoBox.strokeWeight + InfoBox.margin),
            TileInfoBox.boxWidth,
            TileInfoBox.boxHeight
        );

        this.map = null;
        this.tileX = null;
        this.tileY = null;
        this.tileType = null;
        this.tileGroup = null;
    }

    draw() {
        // Call InfoBox's draw
        super.draw();
    }

    update(tileData, map) {
        this.map = map;
        this.tileX = tileData.x;
        this.tileY = tileData.y;
        this.tileType = tileData.type;
        this.tileGroup = tileData.group;

        this.displayTextArray = [
            "Tile: " + this.tileX + ", " + this.tileY,
            "" + Tile.typeStringArray[this.tileType]
        ]
    }
}

class CatInfoBox extends InfoBox {
    static boxWidth = 150;
    static boxHeight = 50;

    constructor() {
        // Call InfoBox's constructor
        super(
            InfoBox.strokeWeight + InfoBox.margin,
            ((InfoBox.strokeWeight + InfoBox.margin) * 2) + CatInfoBox.boxHeight,
            CatInfoBox.boxWidth,
            CatInfoBox.boxHeight
        );

        this.teamIndex = null;
        this.catIndex = null;

    }

    draw() {
        super.draw();
    }

    update(catIndex, teamIndex) {
        this.teamIndex = teamIndex;
        this.catIndex = catIndex;

        this.displayTextArray = [
            "Team: " + GameInfo.world.teams[this.teamIndex].playerName,
            GameInfo.world.teams[this.teamIndex].cats[this.catIndex].name
        ]
    }
}