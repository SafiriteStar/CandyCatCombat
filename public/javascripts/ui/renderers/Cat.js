function calculateOpacity(cat) {
    // If we are dead
    if (cat.current_health <= 0) {
        return Cat.deadOpacity;
    }
    
    for (let i = 0; i < cat.conditions.length; i++) {
        // If we are in stealth
        if (cat.conditions[i].name == "Stealth") {
            return Cat.stealthOpacity;
        }
    }

    // No special opacity conditions so just appear as normal;
    return Cat.aliveOpacity;
}

function calculateScreenPos(x, y, map) {
    let evenOffset = isEven(x) && (-Tile.height) * 1 || 0;
    let screenX = (Tile.width * 1.5 * x) + World.mapDrawOffsets[map][0];
    let screenY = (-Tile.height * 2 * y) + World.mapDrawOffsets[map][1] + evenOffset;

    return [screenX, screenY];
}

function moveToPos(screenX, screenY, path, pathIndex, deltaTime) {
    // There is no "path"
    if (path.length === 1 || screenX === null || screenY === null) {
        return [path[0].screenX, path[0].screenY, 0];
    }

    // Have we reached our destination
    if (path[pathIndex + 1] === null || path[pathIndex + 1] === undefined) {
        // Yes
        return [path[pathIndex].screenX, path[pathIndex].screenY, pathIndex];
    }

    // Are we close enough to it?
    if (Math.abs(path[pathIndex + 1].screenX - screenX) < 5 * 2 && Math.abs(path[pathIndex + 1].screenY - screenY) < 5 * 2) {
        // We are
        // Set our position to the target and return the next index
        return [path[pathIndex + 1].screenX, path[pathIndex + 1].screenY, pathIndex + 1];
    }

    // We have not reached our destination nor are we close enough to snap to it.
    // Calculate vectors
    let originVector = Vector2.v2new(path[pathIndex].screenX, path[pathIndex].screenY);
    let targetVector = Vector2.v2new(path[pathIndex + 1].screenX, path[pathIndex + 1].screenY);
    let targetDirection = Vector2.v2Normalize(Vector2.v2sub(targetVector, originVector));

    // Move to the target, stay on the same index
    return [screenX + ((Cat.moveSpeed * (1 / deltaTime)) * targetDirection.x), screenY + ((Cat.moveSpeed * (1 / deltaTime)) * targetDirection.y), pathIndex];
}

function checkStealth (conditions) {
    for (let i = 0; i < conditions.length; i++) {
        if (conditions[i].name == "Stealth") {
            return true;
        }
    }

    return false;
}

class Cat {
    static width = 300;
    static height = 420;
    static diameter = 100;
    static moveSpeed = 1000;

    static healthBarLength = 200;
    static healthBarHeight = 35;

    static aliveOpacity = 255;
    static deadOpacity = 25;
    static stealthOpacity = 150;

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
        
        this.oldX = null;
        this.oldY = null;
        this.oldMap = null;
        
        [this.screenX, this.screenY] = calculateScreenPos(this.x, this.y, this.map);
        
        this.path = [{screenX:this.screenX, screenY:this.screenY}];
        this.pathIndex = 0;
        
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

        this.img = image;
        this.facingRight = false;

        this.damageFlashTime = 20;
        this.damageFlashTimer = 20;

        this.damageFlashTint = [255, 150, 150];
        this.healFlashTint = [150, 255, 150];
        this.currentFlashTint = this.damageFlashTint;
        

        this.isStealth = false;
        let baseAnimState = "idle";
        this.isStealth = checkStealth(this.conditions);
        if (this.isStealth) {
            baseAnimState = "stealthIdle";
        }

        this.catAnimations = new CatAnimator(this.img, baseAnimState);
    }

    flashDamage() {
        if (this.damageFlashTimer < this.damageFlashTime) {
            this.damageFlashTimer += 1;

            if (this.damageFlashTimer % 5 == 0) {
                tint(this.currentFlashTint[0], this.currentFlashTint[1], this.currentFlashTint[2], this.opacity);
            }
            else {
                tint(255, 255, 255, this.opacity);
            }
        }
        else {
            tint(255, 255, 255, this.opacity);
        }
    }

    draw(teamColor) {
        let currentX = this.screenX;
        
        if (this.catAnimations.state != "faint") {
            [this.screenX, this.screenY, this.pathIndex] = moveToPos(this.screenX, this.screenY, this.path, this.pathIndex, deltaTime);
            currentX = this.screenX;
    
            // If we haven't reached our destination and aren't moving
            if (!(this.pathIndex == this.path.length - 1) && (this.catAnimations.state != "move" && this.catAnimations.state != "moveStealth")) {
                let moveAnimState = "move";
                if (this.isStealth) {
                    moveAnimState = "stealthMove";
                }
                // Do the move animation
                this.catAnimations.changeState(moveAnimState);
            }
            // If we have reached our destination and are playing the move animation
            else if (this.pathIndex == this.path.length - 1 && (this.catAnimations.state == "move" || this.catAnimations.state == "moveStealth")) {
                let idleAnimState = "idle";
                if (this.isStealth) {
                    idleAnimState = "stealthIdle";
                }
                // Play the idle instead
                this.catAnimations.changeState(idleAnimState);
            }
        }

        if (this.map == 0) {
            currentX += GameInfo.world.maps[0].drawStartX - World.mapDrawOffsets[0][0];
        }

        push();
            // Outline the hexagon with the team color
            translate(currentX, this.screenY);
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
                // Get the tint
                this.flashDamage();
                // Main Cat
                this.catAnimations.draw();
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
        this.name = cat.name;
        this.max_health = cat.max_health;
        // Did we take damage
        if (cat.current_health < this.current_health) {
            // Yes, flash red
            this.damageFlashTimer = 0;
            this.currentFlashTint = this.damageFlashTint;
        }
        else if (cat.current_health > this.current_health) {
            // We healed
            this.damageFlashTimer = 0;
            this.currentFlashTint = this.healFlashTint;
        }

        if (cat.current_health <= 0) {
            this.catAnimations.state = "faint";
        }
        this.current_health = cat.current_health;
        this.damage = cat.damage;
        this.defense = cat.defense;
        this.speed = cat.speed;
        this.min_range = cat.min_range;
        this.max_range = cat.max_range;
        this.cost = cat.cost;
        this.state = cat.state;
        this.conditions = cat.conditions;
        this.isStealth = checkStealth(this.conditions);
        this.showDebug = showDebug
        
        // If the cat has moved
        // And we are in the playing or waiting phase
        if ((cat.x !== this.x || cat.y !== this.y || this.map !== cat.boardID - 1)) {
            // Save the old position
            this.oldX = this.x;
            this.oldY = this.y;
            this.oldMap = this.map;

            let moveRange = new RangeHighlighter(false, false, [164, 149, 255, 0], [164, 149, 255, 0], 0.5);
            moveRange.newSource(this, 1, this.stamina);

            this.x = cat.x;
            this.y = cat.y;
            this.map = cat.boardID - 1; // For easier handling of arrays.
            
            // Generate a path
            if (this.oldMap === this.map && (GameInfo.game.player.state == "Playing" || GameInfo.game.player.state == "Waiting")) {
                // Calculate path
                this.path = Pathfinder.getPath(
                    GameInfo.world.getTileInMap(this.oldX, this.oldY, this.oldMap),
                    GameInfo.world.getTileInMap(this.x, this.y, this.map),
                    moveRange.tilesToHighlight);
                this.path.unshift(GameInfo.world.getTileInMap(this.oldX, this.oldY, this.oldMap));
            }
            else {
                this.path = [ GameInfo.world.getTileInMap(this.x, this.y, this.map) ]
            }
            
            this.screenX = null;
            this.screenY = null;
            
            // Reset the map index
            this.pathIndex = 0;
        }
        else {

        }

        this.stamina = cat.stamina;

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