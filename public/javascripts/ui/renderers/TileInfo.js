class TileInfo {
    static width = 150;
    static height = TileInfo.width * 1/2;
    static x = 10;
    static y = GameInfo.height - TileInfo.height - TileInfo.x;
    static cornerRadius = 5;

    constructor() {
        this.tile = null;
        this.cat = null;
    }
    draw() {
        scale(1);
        fill(150, 150, 150, 255);
        stroke(0, 0, 0, 0);
        rect(
            TileInfo.x,
            TileInfo.y,
            TileInfo.width,
            TileInfo.height,
            TileInfo.cornerRadius,
            TileInfo.cornerRadius,
            TileInfo.cornerRadius,
            TileInfo.cornerRadius
        );
        fill(0, 0, 0, 255);
        textAlign(LEFT, CENTER);
        textSize(16);
        textStyle(NORMAL);
        if (this.tile !== null && this.tile !== undefined) {
            text(Tile.typeStringArray[this.tile.type], TileInfo.x + 10, TileInfo.y + (TileInfo.height * 1/3));
        }
        if (this.cat !== null && this.cat !== undefined) {
            text(GameInfo.board.player.cats[this.cat].name, TileInfo.x + 10, TileInfo.y + (TileInfo.height * 2/3));
        }
    }

    update(tile, cat) {
        this.tile = tile;
        if (cat !== null && cat !== undefined) {
            this.cat = cat;
        }
    }
}