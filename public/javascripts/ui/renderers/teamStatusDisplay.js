class teamStatus {
    constructor(x, y, width, height, team) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.team = team;
        console.log(team);
        this.scaler = 0.25;
    }

    update(team) {
        this.team = team;
    }

    draw() {
        push();
        // Background
        stroke(0, 0, 0, 255);
        strokeWeight(3)
        fill("lightgray");
        rect(this.x, this.y, this.width, this.height);
        
        for (let i = 0; i < this.team.length; i++) {
            push();
            translate(this.x + ((this.width / this.team.length) * (i + 0.5)), this.y + (this.height * 0.4));
            scale(this.scaler);
            image(this.team[i].img.base, -this.team[i].img.base.width * 0.5, -this.team[i].img.base.height * 0.5);
            
            // Health Bar Background
            fill("black");
            rect(
                -this.team[i].img.base.width * 0.7 * 0.5,
                this.team[i].img.base.height * 0.5,
                this.team[i].img.base.width * 0.7,
                35);

            // Actual Health Bar
            fill("lightgreen");
            let healthPercent = this.team[i].current_health > 0 && 1 - (this.team[i].max_health - this.team[i].current_health) / this.team[i].max_health || 0
            rect(
                -this.team[i].img.base.width * 0.7 * 0.5,
                this.team[i].img.base.height * 0.5,
                this.team[i].img.base.width * 0.7 * healthPercent,
                35);
            pop();
        }
        
        pop();
    }
}