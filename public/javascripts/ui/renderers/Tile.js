class Tile {
    static width = 150;
    static height = 130;
    static spacing = this.width * 0.5;

    constructor(baseTile) {
        this.x = baseTile.x;
        this.y = baseTile.y;
        this.type = baseTile.type;

        if (!(baseTile.group == null)) {
            this.group = baseTile.group;
        }
    }

    draw(xOffset, yOffset) {
        // Placement
        if (this.type == 3) {
            fill('rgba(186, 251, 255, 1)');
        }
        // Wall
        else if (this.type == 2) {
            fill('rgba(220, 135, 255, 1)');
        }
        // Normal
        else if (this.type == 1) {
            fill('rgba(246, 255, 253, 1)');
        }
        // If something went wrong, print black
        else {
            fill('rgba(0, 0, 0, 1)');
        }
        // Outline
        stroke(0);
        strokeWeight(5);
        push();
            // Some short circuiting "magic"
            let evenOffset = isEven(this.y) && (Tile.width * Board.scale) * 1.5 || 0;
            translate(
                Board.startPosX + (Tile.width * 3 * Board.scale * this.x) + evenOffset + xOffset,
                Board.startPosY - (Tile.height * 1 * Board.scale * this.y) + yOffset
            );
            scale(Board.scale);
            beginShape();
                vertex(-Tile.width * 0.5, -Tile.height);  // Top Left
                vertex(Tile.width * 0.5, -Tile.height);   // Top Right
                vertex(Tile.width, 0);                    // Middle Right
                vertex(Tile.width * 0.5, Tile.height);    // Bottom Right
                vertex(-Tile.width * 0.5, Tile.height);   // Bottom Left
                vertex(-Tile.width, 0);                   // Middle Left
            endShape(CLOSE);

            // Debug Text Inside
            fill(0, 0, 0);
            stroke(0);
            strokeWeight(1);
            textSize(72)
            text(this.x + ", " + this.y, -60, 0);
        pop();
    }

    update(tile) {
        this.x = tile.x;
        this.y = tile.y;
        this.type = tile.type;
    }
}