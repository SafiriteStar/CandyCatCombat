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
        this.description = cat.description;
        this.conditions = cat.conditions;

        this.showDebug = showDebug;

        this.opacity = calculateOpacity(cat);

        this.img = image
        this.facingRight = false;
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
            translate(
                (Tile.width * 1.5 * currentX) + xOffset,
                (-Tile.height * 2 * currentY) + yOffset + evenOffset
            );
            push();
            stroke(teamColor[0], teamColor[1], teamColor[2], this.opacity);
            strokeWeight(24);
            fill(0, 0, 0, 0);
            Tile.drawScaledTile(0, 0, 0.8);
            pop();

            stroke(0, 0, 0, this.opacity);
            strokeWeight(0);
            fill(Cat.catColor[this.type - 1][0], Cat.catColor[this.type - 1][1], Cat.catColor[this.type - 1][2], this.opacity);

            // Main Cat Picture
            push();
                if (this.facingRight) {
                    scale(-1, 1);
                }
                tint(255, 255, 255, this.opacity);
                // Main Cat
                image(this.img.base, -this.img.base.width * 0.5, -this.img.base.height * 0.5);
                // Weapon
                image(this.img.weapon, -this.img.weapon.width * 0.5, -this.img.base.height * 0.5);
            pop();

            // Condition images
            push();
                tint(255, 255, 255, this.opacity);
                scale(0.25);
                for (let i = 0; i < this.conditions.length; i++) {
                    if (this.conditions[i].name == "Rooted") {
                        image(
                            GameInfo.images.ui.rooted,
                            (-GameInfo.images.ui.rooted.width * 0.5 * (i + 1)) + (-GameInfo.images.ui.rooted.width * 0.5),
                            (-GameInfo.images.ui.rooted.height * 0.5) + (-GameInfo.images.ui.rooted.height * 0.5)
                        );
                    }
                    else if (this.conditions[i].name == "Stealth") {
                        image(
                            GameInfo.images.ui.stealthed,
                            (-GameInfo.images.ui.stealthed.width * 0.5 * (i + 1)) + (-GameInfo.images.ui.stealthed.width * 0.5),
                            (-GameInfo.images.ui.stealthed.height * 0.5) + (-GameInfo.images.ui.stealthed.height * 0.5)
                        );
                    }
                }
            pop();

            if (this.current_health > 0) {
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
                strokeWeight(5);
                rect(
                    -Cat.healthBarLength * 0.5,
                    Tile.height - (Cat.healthBarHeight * 2),
                    Cat.healthBarLength,
                    Cat.healthBarHeight
                );
            }
        pop();
    }

    isRooted() {
        for (let i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i].name == "Rooted") {
                return true;
            }
        }

        return false;
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

    updateFace(opponentCats) {
        // Get our starting tile
        let shortestX = Infinity;
        let shortestY = Infinity;
        let closestOpponent = null;

        // For each opponent
        for (let i = 0; i < opponentCats.length; i++) {

            let distXToOpponent = Math.abs(opponentCats[i].x - this.x);
            let distYToOpponent = Math.abs(opponentCats[i].y - this.y);

            // If the path is shorter than our current one
            if (distXToOpponent < shortestX && distYToOpponent < shortestY) {
                // We have a cat that is closer
                // Update our shortest distance
                shortestX = distXToOpponent;
                shortestY = distYToOpponent;
                // Update our closest opponent
                closestOpponent = opponentCats[i];
            }
        }

        // If we have a closest opponent
        if (closestOpponent !== null && closestOpponent !== undefined) {
            // If they are to the right and we are facing left
            if (closestOpponent.x > this.x && !this.facingRight) {
                // Flip
                this.facingRight = true;
            }
            // If they are to the left and we are facing right
            else if (closestOpponent.x < this.x && this.facingRight) {
                // Flip
                this.facingRight = false;
            }
        }
    }
}