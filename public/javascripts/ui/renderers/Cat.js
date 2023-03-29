class Cat {
    static width = 300;
    static height = 420;
    static diameter = 20;
    
    constructor(cat, showDebug) {
        this.id = cat.id;
        this.type = cat.type;
        this.x = cat.x;
        this.y = cat.y;
        this.placementX = null;
        this.placementY = null;
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

    draw(xOffset, yOffset) {
        // Circle for now, make it into an image later
        fill(100, 100, 100);
        stroke(0, 0, 0);
        strokeWeight(0);

        // Some short circuiting "magic"
        let evenOffset = isEven(this.y || this.placementY) && (Tile.width * Board.scale) * 1.5 || 0;
        circle(
            Board.startPosX + (Tile.width * 3 * Board.scale * (this.x || this.placementX)) + evenOffset + xOffset,
            Board.startPosY - (Tile.height * 1 * Board.scale * (this.y || this.placementY)) + yOffset,
            Cat.diameter
        );

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