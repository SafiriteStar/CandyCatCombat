const pool = require("../../../config/database");
const Play = require("../playsInit");
require("../playsUtils");
const CatStandardAttack = require("./standardAttack");

class GumCatAttack extends CatStandardAttack {
    constructor(playerCat, targetSearchTeams, playerSearchTeams) {
        super(playerCat, targetSearchTeams, playerSearchTeams);
    }

    async attack(targetCatData) {
        let damageDealt = this.playerCat.damage;
        let playerCat = this.playerCat;

        // Are we stealthed or were we going to stealth?
        this.playerCat.conditions.forEach(async function (condition) {
            if (condition.id === 1) {
                // Yup, double our damage
                damageDealt = damageDealt * 2;
                // Remove stealth from this cat
                await Play.removeCondition(condition.game_id);
                // Add the ReStealth to the cat (id = 3)
                await Play.addCondition(playerCat.id, 3, 1);
            }
            else if (condition.id === 3) {
                // ReStealth
                // Set the counter back to 1
                await Play.setConditionDuration(condition.game_id, 1);
            }
        });

        damageDealt = targetCatData.defense - this.playerCat.damage;

        // APPLY DAMAGE
        await Play.applyDamage(damageDealt, targetCatData.id);

        // In case we need it, give back who we hit and for how much
        return [targetCatData.id, damageDealt];
    }

    static async reStealthCheck(playerCat, attackSuccessful) {
        // Are we a stealth cat that didn't attack?
        if (playerCat.type === 4 && attackSuccessful === false) {
            // Yes
            // Do we have a ReStealth counter?
            for (let i = 0; i < playerCat.conditions.length; i++) {
                if (playerCat.conditions[i].id == 3) {
                    // We do
                    // Is it at 3?
                    if (playerCat.conditions[i].duration === 3) {
                        // Yes
                        // Remove it
                        await Play.removeCondition(playerCat.conditions[i].game_id);
                        // And add stealth
                        await Play.addCondition(playerCat.id, 1, null);
                    }
                    else {
                        // No
                        // Increase it
                        await Play.tickConditionDuration(playerCat.conditions[i].game_id, 1);
                    }
                }
            }
        }
    }
}

module.exports = GumCatAttack;