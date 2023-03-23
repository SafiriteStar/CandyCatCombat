class Cat {
    static width = 300;
    static height = 600;
    static screenX = 100;
    static screenY = 100;
    
    constructor(cat) {
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
        rect(Cat.screenX, Cat.screenY, Cat.width, Cat.height, 5, 5, 5, 5);
        fill(0, 0, 0);
        textAlign(LEFT, CENTER);
        textSize(16);
        textStyle(NORMAL);
        text("id: " + this.id, Cat.screenX + 10, Cat.screenY * 1/16)
        text("team_id: " + this.team_id, Cat.screenX + 10, Cat.screenY * 2/16)
        text("type: " + this.type, Cat.screenX + 10, Cat.screenY * 3/16)
        text("x: " + this.x, Cat.screenX + 10, Cat.screenY * 4/16)
        text("y: " + this.y, Cat.screenX + 10, Cat.screenY * 5/16)
        text("name: " + this.name, Cat.screenX + 10, Cat.screenY * 6/16)
        text("max_health: " + this.max_health, Cat.screenX + 10, Cat.screenY * 7/16)
        text("current_health: " + this.current_health, Cat.screenX + 10, Cat.screenY * 8/16)
        text("damage: " + this.damage, Cat.screenX + 10, Cat.screenY * 9/16)
        text("defense: " + this.defense, Cat.screenX + 10, Cat.screenY * 10/16)
        text("speed: " + this.speed, Cat.screenX + 10, Cat.screenY * 11/16)
        text("stamina: " + this.stamina, Cat.screenX + 10, Cat.screenY * 12/16)
        text("min_range: " + this.min_range, Cat.screenX + 10, Cat.screenY * 13/16)
        text("max_range: " + this.max_range, Cat.screenX + 10, Cat.screenY * 14/16)
        text("cost: " + this.cost, Cat.screenX + 10, Cat.screenY * 15/16)
        text("state: " + this.state, Cat.screenX + 10, Cat.screenY * 16/16)
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