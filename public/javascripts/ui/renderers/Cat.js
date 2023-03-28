class Cat {
    static width = 300;
    static height = 420;
    
    constructor(cat, screenX, screenY) {
        this.screenX = screenX;
        this.screenY = screenY;
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

    draw() {
        fill(100, 100, 100);
        stroke(0, 0, 0);
        strokeWeight(0);
        rect(this.screenX, 0, Cat.width, Cat.height, 5, 5, 5, 5);
        fill(0, 0, 0);
        textAlign(LEFT, CENTER);
        textSize(16);
        textStyle(NORMAL);
        text("id: " + this.id, this.screenX + 10, this.screenY * 1/16)
        text("team_id: " + this.team_id, this.screenX + 10, this.screenY * 2/16)
        text("type: " + this.type, this.screenX + 10, this.screenY * 3/16)
        text("x: " + 100, this.screenX + 10, this.screenY * 4/16)
        text("y: " + 100, this.screenX + 10, this.screenY * 5/16)
        text("name: " + this.name, this.screenX + 10, this.screenY * 6/16)
        text("max_health: " + this.max_health, this.screenX + 10, this.screenY * 7/16)
        text("current_health: " + this.current_health, this.screenX + 10, this.screenY * 8/16)
        text("damage: " + this.damage, this.screenX + 10, this.screenY * 9/16)
        text("defense: " + this.defense, this.screenX + 10, this.screenY * 10/16)
        text("speed: " + this.speed, this.screenX + 10, this.screenY * 11/16)
        text("stamina: " + this.stamina, this.screenX + 10, this.screenY * 12/16)
        text("min_range: " + this.min_range, this.screenX + 10, this.screenY * 13/16)
        text("max_range: " + this.max_range, this.screenX + 10, this.screenY * 14/16)
        text("cost: " + this.cost, this.screenX + 10, this.screenY * 15/16)
        text("state: " + this.state, this.screenX + 10, this.screenY * 16/16)
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