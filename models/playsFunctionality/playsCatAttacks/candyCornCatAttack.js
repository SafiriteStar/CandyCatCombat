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
            await this.attackRandomTarget();
            await this.attackRandomTarget();
        }
        else {
            // Attack once
            await this.attackRandomTarget();
        }
    }
}

module.exports = CandyCornCatAttack;