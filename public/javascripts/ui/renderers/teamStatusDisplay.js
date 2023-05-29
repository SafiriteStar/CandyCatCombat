class TeamStatus {
    constructor(x, y, width, height, team) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.team = team;
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
        
        let totalTeamMaxHealth = 0;
        let totalTeamCurrentHealth = 0;
        for (let i = 0; i < this.team.length; i++) {
            totalTeamMaxHealth = totalTeamMaxHealth + this.team[i].max_health;
            totalTeamCurrentHealth = totalTeamCurrentHealth + this.team[i].current_health;
            push();
            translate(this.x + ((this.width / this.team.length) * (i + 0.5)), this.y + (this.height * 0.55));
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
        
        push();
        fill("black");
        stroke("black");
        strokeWeight(1);
        rect(this.x + (this.width * 0.05), this.y + (this.height * 0.125), this.width * 0.9, this.height * 0.1);
        pop();

        push();
        fill("lightgreen");
        stroke("black");
        strokeWeight(1);
        rect(this.x + (this.width * 0.05), this.y + (this.height * 0.125), this.width * 0.9 * (totalTeamCurrentHealth / totalTeamMaxHealth), this.height * 0.1);
        pop();

        pop();
    }
}