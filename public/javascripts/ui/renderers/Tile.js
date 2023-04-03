class Tile {
    static width = 150;
    static height = 130;
    static spacing = this.width * 0.5;

    constructor(baseTile, xOffset, yOffset) {
        this.x = baseTile.x;
        this.y = baseTile.y;
        this.type = baseTile.type;

        // Some short circuiting "magic"
        // If its even then displace it by Tile.width * 1.5
        // If its not even then displace it by 0
        let evenOffset = isEven(this.y) && (-Tile.width) * 1.5 || 0;
        // The X and Y in terms of pixels
        this.screenX = (Tile.width * 3 * this.x) + evenOffset + xOffset;
        this.screenY = (-Tile.height * 1 * this.y) + yOffset;

        if (!(baseTile.group == null)) {
            this.group = baseTile.group;
        }
    }

    draw() {

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
            translate(this.screenX, this.screenY);
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