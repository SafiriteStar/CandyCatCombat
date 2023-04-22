const pool = require("../../../config/database");
const Play = require("../playsInit");
const CatStandardAttack = require("./standardAttack");

class CandyCornCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
    }

    async executeAttackSequence() {
        // Get the cats we can attack
        this.generateAttackTargetList();
        // If we haven't moved
        if (this.playerCat.stamina === this.playerCat.speed) {
            // Attack twice
            console.log("Attacking twice");
            console.log("I AM " + this.playerCat.name);
            await this.attackRandomTarget();
            console.log("Second attack");
            await this.attackRandomTarget();
        }
        else {
            // Attack once
            console.log("Attacking once");
            await this.attackRandomTarget();
        }
    }
}

module.exports = CandyCornCatAttack;