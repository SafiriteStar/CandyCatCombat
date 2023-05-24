const pool = require("../../../config/database");
const Play = require("../playsInit");
require("../playsUtils");
const CatStandardAttack = require("./standardAttack");

class CaramelCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
    }

    async attack(targetCatData, distance) {
        let damageDealt = targetCatData.defense - this.playerCat.damage;

        // If we are in melee range
        if (distance === 0) {
            // APPLY DAMAGE
            await Play.applyDamage(damageDealt, targetCatData.id);
        }

        // Root the target
        await Play.addCondition(targetCatData.id, 2, 1);

        return [targetCatData.id, damageDealt];
    }

    async attackRandomTarget() {
        let targetCat = this.getRandomAttackTarget();

        let targetHit, damageDealt;
        if (targetCat !== null && targetCat !== undefined) {
            [targetHit, damageDealt] = await this.attack(this.targetSearchTeams[targetCat.teamIndex].team.cats[targetCat.catIndex], targetCat.distance);
        }

        // In case we need it, give back who we hit and for how much
        return targetHit !== null && targetHit !== undefined;
    }
}

module.exports = CaramelCatAttack;