class Tile {
    static width = 150;
    static height = 130;
    static spacing = this.width * 0.5;

    static typeStringArray = [
        "Err",
        "Normal",
        "Wall",
        "Placement"
    ]

    constructor(baseTile) {
        this.x = baseTile.x;
        this.y = baseTile.y;
        this.map = baseTile.map;
        this.type = baseTile.type;
        this.group = null;
        this.connections = baseTile.connections;

        // Some short circuiting "magic"
        // If its even then displace it by Tile.width * 1.5
        // If its not even then displace it by 0
        let evenOffset = isEven(this.x) && (-Tile.height) * 1 || 0;
        // The X and Y in terms of pixels
        this.screenX = (Tile.width * 1.5 * this.x);
        this.screenY = (-Tile.height * 2 * this.y) + evenOffset;

        if (!(baseTile.group == null)) {
            this.group = baseTile.group;
        }
    }

    static drawSimpleTile(x, y) {
        // Some short circuiting "magic"
        translate(x, y);
        beginShape();
            vertex(-Tile.width * 0.5, -Tile.height);  // Top Left
            vertex(Tile.width * 0.5, -Tile.height);   // Top Right
            vertex(Tile.width, 0);                    // Middle Right
            vertex(Tile.width * 0.5, Tile.height);    // Bottom Right
            vertex(-Tile.width * 0.5, Tile.height);   // Bottom Left
            vertex(-Tile.width, 0);                   // Middle Left
        endShape(CLOSE);
    }

    static drawScaledTile(x, y, scaler) {
        // Some short circuiting "magic"
        translate(x, y);
        scale(scaler);
        beginShape();
            vertex(-Tile.width * 0.5, -Tile.height);  // Top Left
            vertex(Tile.width * 0.5, -Tile.height);   // Top Right
            vertex(Tile.width, 0);                    // Middle Right
            vertex(Tile.width * 0.5, Tile.height);    // Bottom Right
            vertex(-Tile.width * 0.5, Tile.height);   // Bottom Left
            vertex(-Tile.width, 0);                   // Middle Left
        endShape(CLOSE);
    }

    draw() {
        push();
        translate(this.screenX, this.screenY);
        // Placement
        if (this.type == 3) {
            if (GameInfo.game.player.state == "Placement") {
                fill('rgba(186, 251, 255, 1)');
            }
            else {
                fill('rgba(246, 255, 253, 1)');
            }
        }
        // Wall
        else if (this.type == 2) {
            fill('rgba(220, 135, 255, 1)');
        }
        // Normal
        else if (this.type == 1) {
            fill('rgba(246, 255, 253, 1)');
            
            image(GameInfo.images.tiles.normal, -GameInfo.images.tiles.normal.width * 0.5, -GameInfo.images.tiles.normal.height * 0.5);
        }
        // If something went wrong, print black
        else {
            fill('rgba(0, 0, 0, 1)');
        }
        pop();
        // Outline
        stroke(0);
        strokeWeight(5);
        push();
            //Tile.drawSimpleTile(this.screenX, this.screenY);

            // Debug Text Inside
            fill(0, 0, 0);
            stroke(0);
            strokeWeight(1);
            textSize(72)
            //text(this.x + ", " + this.y, -60, 0);
        pop();
    }

    update(tile) {
        this.x = tile.x;
        this.y = tile.y;
        this.type = tile.type;

        if (!(tile.group == null)) {
            this.group = tile.group;
        }
    }
}