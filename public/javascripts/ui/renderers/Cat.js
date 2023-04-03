class Cat {
    static width = 300;
    static height = 420;
    static diameter = 100;

    static healthBarLength = 200;
    static healthBarHeight = 35;

    static catColor = [
        [255, 0, 0],
        [9, 0, 255],
        [120, 0, 255],
        [0, 255, 102],
        [255, 239, 0],
        [255, 145, 0],
        [247, 0, 255]
    ];
    
    constructor(cat, showDebug) {
        this.id = cat.id;
        this.type = cat.type;
        this.x = cat.x;
        this.y = cat.y;
        this.placementX = cat.placementX;
        this.placementY = cat.placementY;
        this.name = cat.name;
        this.max_health = cat.max_health;
        this.current_health = cat.current_health;
        this.damage = cat.damage;
        this.defense = cat.defense;
        this.speed = cat.speed;
        this.stamina = cat.stamina;
        this.min_range = cat.min_range;
        this.max_range = cat.max_range;
        this.cost = cat.cost;
        this.state = cat.state;

        this.showDebug = showDebug
    }

    draw(teamColor) {

        let evenOffset = isEven(this.y || this.placementY) && (-Tile.width) * 1.5 || 0;
        let currentX = (this.x || this.placementX);
        let currentY = (this.y || this.placementY);
        // More short circuiting "magic"
        // Be careful with the order of the "||" and the 0
        let xOffset = !(this.placementX == null) && Board.placementBoardXOffset || 0;
        let yOffset = !(this.placementY == null) && Board.placementBoardYOffset || 0;
        
        // Circle for now, make it into an image later
        strokeWeight(4);
        
        // Outline the hexagon with the team color
        stroke(teamColor[0], teamColor[1], teamColor[2]);
        strokeWeight(24);
        fill(0, 0, 0, 0);
        push();
            translate(
                (Tile.width * 3 * currentX) + evenOffset + xOffset,
                (-Tile.height * 1 * currentY) + yOffset
            );
            beginShape();
            vertex(-Tile.width * 0.5, -Tile.height);  // Top Left
            vertex(Tile.width * 0.5, -Tile.height);   // Top Right
            vertex(Tile.width, 0);                    // Middle Right
            vertex(Tile.width * 0.5, Tile.height);    // Bottom Right
            vertex(-Tile.width * 0.5, Tile.height);   // Bottom Left
            vertex(-Tile.width, 0);                   // Middle Left
            endShape(CLOSE);
            
            stroke(0);
            strokeWeight(0);
            fill(Cat.catColor[this.type - 1][0], Cat.catColor[this.type - 1][1], Cat.catColor[this.type - 1][2], 255);
            
            // Filler circle to represent cat
            circle(
                0,
                0,
                Cat.diameter
            );
            
            // Health Bar
            fill(teamColor[0], teamColor[1], teamColor[2], 255);
            stroke(teamColor[0], teamColor[1], teamColor[2], 255);
            strokeWeight(1);
            rect(
                -Cat.healthBarLength * 0.5,
                Tile.height - (Cat.healthBarHeight * 2),
                Cat.healthBarLength * (1 - (this.max_health - this.current_health)),
                Cat.healthBarHeight
            );
            // Health Bar Outline
            fill(255, 255, 255, 0);
            stroke(0, 0, 0,  255);
            strokeWeight(12);
            rect(
                -Cat.healthBarLength * 0.5,
                Tile.height - (Cat.healthBarHeight * 2),
                Cat.healthBarLength,
                Cat.healthBarHeight
            );
        pop();
            
        

        if (this.showDebug) {
            fill(100, 100, 100);
            stroke(0, 0, 0);
            strokeWeight(0);
            rect(mouseX, mouseY, Cat.width, Cat.height, 5, 5, 5, 5);
            fill(0, 0, 0);
            textAlign(LEFT, CENTER);
            textSize(16);
            textStyle(NORMAL);
            text("id: " + this.id, mouseX + 10,                         (this.screenY * 1/16) + mouseY)
            text("type: " + this.type, mouseX + 10,                     (this.screenY * 2/16) + mouseY)
            text("x: " + this.x, mouseX + 10,                           (this.screenY * 3/16) + mouseY)
            text("y: " + this.y, mouseX + 10,                           (this.screenY * 4/16) + mouseY)
            text("name: " + this.name, mouseX + 10,                     (this.screenY * 5/16) + mouseY)
            text("max_health: " + this.max_health, mouseX + 10,         (this.screenY * 6/16) + mouseY)
            text("current_health: " + this.current_health, mouseX + 10, (this.screenY * 7/16) + mouseY)
            text("damage: " + this.damage, mouseX + 10,                 (this.screenY * 8/16) + mouseY)
            text("defense: " + this.defense, mouseX + 10,               (this.screenY * 9/16) + mouseY)
            text("speed: " + this.speed, mouseX + 10,                   (this.screenY * 10/16) + mouseY)
            text("stamina: " + this.stamina, mouseX + 10,               (this.screenY * 11/16) + mouseY)
            text("min_range: " + this.min_range, mouseX + 10,           (this.screenY * 12/16) + mouseY)
            text("max_range: " + this.max_range, mouseX + 10,           (this.screenY * 13/16) + mouseY)
            text("cost: " + this.cost, mouseX + 10,                     (this.screenY * 14/16) + mouseY)
            text("state: " + this.state, mouseX + 10,                   (this.screenY * 15/16) + mouseY)
        }
    }

    update(cat) {
        this.id = cat.id;
        this.team_id = cat.team_id;
        this.type = cat.type;
        this.x = cat.x;
        this.y = cat.y;
        this.name = cat.name;
        this.max_health = cat.max_health;
        this.current_health = cat.current_health;
        this.damage = cat.damage;
        this.defense = cat.defense;
        this.speed = cat.speed;
        this.stamina = cat.stamina;
        this.min_range = cat.min_range;
        this.max_range = cat.max_range;
        this.cost = cat.cost;
        this.state = cat.state;
    }
}