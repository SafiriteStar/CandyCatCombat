const pool = require("../config/database");

async function populateMap() {
    console.log("Checking map data");

    let [preMapCheck] = await pool.query(`
        select *
        from tile
    `);

    if (!(preMapCheck.length > 0)) {
        console.log("Map not found --- Creating map...");

        // First map, 38 by 16
        for (let i = 0; i < 37; i++) {
            for (let j = 0; j < 16; j++) {
                // Fill with normal tiles for now
                await pool.query(
                    `insert into tile (tile_x, tile_y, tile_type_id, tile_board_id) values ( ?, ?, ?, ? )`,
                        [j, i, 1, 1]
                );
            }
        }

        // Add in some walls
        for (let i = 6; i <= 9; i++) {
            for (let j = 10; j <= 14; j++) {
                await pool.query(
                    `update tile set tile_type_id = 2 where tile_x = ? and tile_y = ?`,
                        [i, j]
                );
            }
        }

        // Add in some placement tiles
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                await pool.query(
                    `update tile set tile_type_id = 3 where tile_x = ? and tile_y = ?`,
                        [i, j]
                );
            }
            
        }

        console.log("Map created!");
    }
    else {
        console.log("Map(s) Found");
    }
};

module.exports = populateMap;