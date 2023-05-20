function calculateOpacity(cat) {
    // If we are dead
    if (cat.current_health <= 0) {
        return Cat.deadOpacity;
    }
    
    for (let i = 0; i < cat.conditions.length; i++) {
        // If we are in stealth
        if (cat.conditions[i].id == 1) {
            return Cat.stealthOpacity;
        }
    }

    // No special opacity conditions so just appear as normal;
    return Cat.aliveOpacity;
}

class Cat {
    static width = 300;
    static height = 420;
    static diameter = 100;

    static healthBarLength = 200;
    static healthBarHeight = 35;

    static aliveOpacity = 255;
    static deadOpacity = 25;
    static stealthOpacity = 200;

    static catColor = [
        [255, 0, 0],
        [9, 0, 255],
        [120, 0, 255],
        [0, 255, 102],
        [255, 239, 0],
        [255, 145, 0],
        [247, 0, 255]
    ];
    
    constructor(cat, image, showDebug) {
        this.id = cat.id;
        this.type = cat.type;
        this.x = cat.x;
        this.y = cat.y;
        this.map = cat.boardID - 1; // For easier handling of arrays.
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
        this.conditions = cat.conditions;

        this.showDebug = showDebug;

        this.opacity = calculateOpacity(cat);

        this.img = image
    }

    draw(teamColor) {

        let currentX = (this.x);
        let currentY = (this.y);
        // More short circuiting "magic"
        // Be careful with the order of the "||" and the 0
        let evenOffset = isEven(currentX) && (-Tile.height) * 1 || 0;
        let xOffset = GameInfo.world.maps[this.map].drawStartX;
        let yOffset = GameInfo.world.maps[this.map].drawStartY;
        
        push();
            // Outline the hexagon with the team color
            stroke(teamColor[0], teamColor[1], teamColor[2], this.opacity);
            strokeWeight(24);
            fill(0, 0, 0, 0);
            translate(
                (Tile.width * 1.5 * currentX) + xOffset,
                (-Tile.height * 2 * currentY) + yOffset + evenOffset
            );
            beginShape();
            vertex(-Tile.width * 0.5, -Tile.height);  // Top Left
            vertex(Tile.width * 0.5, -Tile.height);   // Top Right
            vertex(Tile.width, 0);                    // Middle Right
            vertex(Tile.width * 0.5, Tile.height);    // Bottom Right
            vertex(-Tile.width * 0.5, Tile.height);   // Bottom Left
            vertex(-Tile.width, 0);                   // Middle Left
            endShape(CLOSE);
            
            stroke(0, 0, 0, this.opacity);
            strokeWeight(0);
            fill(Cat.catColor[this.type - 1][0], Cat.catColor[this.type - 1][1], Cat.catColor[this.type - 1][2], this.opacity);
            // Filler circle to represent cat
            circle(
                0,
                0,
                Cat.diameter
            );

            // Stand in image for now
            push();
                scale(0.5);
                tint(255, 255, 255, this.opacity);
                image(this.img, -this.img.width * 0.5, -this.img.height * 0.5);
            pop();

            // Health Bar Background
            fill(255, 255, 255, 255);
            stroke(0, 0, 0, 0);
            strokeWeight(1);
            rect(
                -Cat.healthBarLength * 0.5,
                Tile.height - (Cat.healthBarHeight * 2),
                Cat.healthBarLength,
                Cat.healthBarHeight
            );
            
            // Health Bar
            fill(teamColor[0], teamColor[1], teamColor[2], this.opacity);
            stroke(teamColor[0], teamColor[1], teamColor[2], this.opacity);
            strokeWeight(1);
            rect(
                -Cat.healthBarLength * 0.5,
                Tile.height - (Cat.healthBarHeight * 2),
                Cat.healthBarLength * (1 - (this.max_health - this.current_health) / this.max_health),
                Cat.healthBarHeight
            );
            // Health Bar Outline
            fill(255, 255, 255, 0);
            stroke(0, 0, 0, this.opacity);
            strokeWeight(12);
            rect(
                -Cat.healthBarLength * 0.5,
                Tile.height - (Cat.healthBarHeight * 2),
                Cat.healthBarLength,
                Cat.healthBarHeight
            );
        pop();
    }

    update(cat, showDebug) {
        this.id = cat.id;
        this.type = cat.type;
        this.x = cat.x;
        this.y = cat.y;
        this.map = cat.boardID - 1; // For easier handling of arrays.
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
        this.conditions = cat.conditions;

        this.showDebug = showDebug

        this.opacity = calculateOpacity(cat);
    }
}