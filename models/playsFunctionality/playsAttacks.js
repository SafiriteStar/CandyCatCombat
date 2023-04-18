const pool = require("../../config/database");
const Play = require("./playsInit");

Play.applyDamage = async function(damage, catDBID) {
    await pool.query(`Update game_team_cat set gtc_current_health = gtc_current_health + ? where gtc_id = ?`,
        [damage, catDBID]);
}