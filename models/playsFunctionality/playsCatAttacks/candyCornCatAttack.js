const pool = require("../../../config/database");
const Play = require("../playsInit");
const CatStandardAttack = require("./standardAttack");

class CandyCornCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
    }

    async attack(targetCatData) {
        
        let damageDealt = targetCatData.defense - this.playerCat.damage;
        
        if (targetCatData.cat_id === 1) {
            damageDealt = damageDealt * 0.5;
        }

        // APPLY DAMAGE
        await Play.applyDamage(damageDealt, targetCatData.id);

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, damageDealt];
    }

    async executeAttackSequence() {
        
        // Get the cats we can attack
        this.generateAttackTargetList();
        let hitTarget = false; 
        // If we haven't moved
        if (this.playerCat.stamina === this.playerCat.speed) {
            // Attack twice
            hitTarget = await this.attackRandomTarget();
            await this.attackRandomTarget();
        }
        else {
            // Attack once
            hitTarget = await this.attackRandomTarget();
        }

        // Return true if we hit someone, false if else
        return hitTarget;
    }
}

module.exports = CandyCornCatAttack;