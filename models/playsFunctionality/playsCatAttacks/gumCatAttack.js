const pool = require("../../../config/database");
const Play = require("../playsInit");
require("../playsUtils");
const CatStandardAttack = require("./standardAttack");

class GumCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
    }

    async attack() {
        let damageDealt = this.playerCat.damage;

        // Are we stealthed?
        this.playerCat.conditions.forEach(async function (condition) {
            if (condition.name === "Stealth") {
                // Yup, double our damage
                damageDealt = this.playerCat.damage * 2;
                // Remove stealth from this cat
                await Play.removeCondition(condition.id);
            }
        });

        damageDealt = targetCatData.defense - this.playerCat.damage;
        console.log("Attacking Cat: " + this.playerCat.name + " GTC ID: " + this.playerCat.id);
        console.log("Attack: " + this.playerCat.damage);
        console.log("Defending Cat: " + targetCatData.name + " GTC ID: " + targetCatData.id);
        console.log("Defense: " + targetCatData.defense);
        console.log("Damage Dealt: " + damageDealt);
        console.log("Updating database...");

        // APPLY DAMAGE
        await Play.applyDamage(damageDealt, targetCatData.id);

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, damageDealt];
    }
}

module.exports = GumCatAttack;