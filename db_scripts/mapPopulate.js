const pool = require("../config/database");

class TileTypeGroup {
    constructor(startX, startY, width, height, type, group) {
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
        this.type = type;
        this.group = group;
    }
}

class DatabaseMap {
    constructor(width, height, placementGroups, wallGroups) {
        this.width = width;
        this.height = height;
        this.placementGroups = placementGroups; // Array of TileTypeGroups
        this.wallGroups = wallGroups;           // Array of TileTypeGroups
    }

    async create(boardIDIndex) {
        // Initially, fill everything with normal tiles
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                await pool.query(`Insert into tile (tile_x, tile_y, tile_type_id, tile_board_id) values (?, ?, ?, ?)`,
                    [j, i, 1, boardIDIndex]);
            }
        }

        // For every wall group
        for (let i = 0; i < this.wallGroups.length; i++) {
            // Add in the walls
            for (let j = 0; j < this.wallGroups[i].height; j++) {
                for (let k = 0; k < this.wallGroups[i].width; k++) {
                    await pool.query(`Update tile set tile_type_id = ? where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                        [2, j, i, boardIDIndex]);
                }
            }
        }

        // For every placement group
        for (let i = 0; i < this.placementGroups.length; i++) {
            // Add in the placement tile
            for (let j = 0; j < this.placementGroups[i].height; j++) {
                for (let k = 0; k < this.placementGroups[i].width; k++) {
                    await pool.query(`Update tile set tile_type_id = ? where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                        [3, j, i, boardIDIndex]);
                }
            }

            // Add in the group connection data to the group table
            for (let j = 0; j < this.placementGroups[i].height; j++) {
                for (let k = 0; k < this.placementGroups[i].width; k++) {
                    await pool.query(`Insert into placement_tile_group (ptg_tile_board_id, ptg_tile_x, ptg_tile_y, ptg_group) values (?, ?, ?, ?)`,
                        [boardIDIndex, j, i, this.placementGroups[i].group]);
                }
            }
        }
    }
}

async function populateMap() {
    console.log("Checking map data");

    let [preMapCheck] = await pool.query(
        `Select *
        from tile`
    );

    if (!(preMapCheck.length > 0)) {
        console.log("- Map not found -");
        console.log("Creating map...");

        /* let boards = [
            // Placement Map
            new DatabaseMap(
                6, 1,
                [   new TileTypeGroup(0, 0, 2, null)    ],
                [   new TileTypeGroup(6, 1, 3, 0)       ]),
            // Map 1
            new DatabaseMap(
                20, 33
                [   new TileTypeGroup(14, 9, 2, null)   ],
                [   
                    new TileTypeGroup()
                ])
        ] */;
        

        let boardIDIndex = 1;

        // Placement Map, 6 by 1
        for (let i = 0; i < 6; i++) {
            // Fill with placement tiles
            await pool.query(
                `Insert into tile (tile_x, tile_y, tile_type_id, tile_board_id) values ( ?, ?, ?, ? )`,
                    [i, 0, 3, boardIDIndex]
            );
            // Each placement tile also needs to know who they are connected to
            await pool.query(
                `Insert into placement_tile_group (ptg_tile_board_id, ptg_tile_x, ptg_tile_y, ptg_group) values (?, ?, ?, ?)`,
                    [boardIDIndex, i, 0, 0]
            );
        }

        // Increment for next map
        boardIDIndex++;

        // First map
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 33; j++) {
                // Fill with normal tiles for now
                await pool.query(
                    `Insert into tile (tile_x, tile_y, tile_type_id, tile_board_id) values ( ?, ?, ?, ? )`,
                        [j, i, 1, boardIDIndex]
                );
            }
        }

        // Add in some walls
        for (let i = 6; i <= 9; i++) {
            for (let j = 10; j <= 14; j++) {
                await pool.query(
                    `Update tile set tile_type_id = 2 where tile_x = ? and tile_y = ?`,
                        [i, j]
                );
            }
        }

        // Add in some placement tiles for player 1
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                await pool.query(
                    `Update tile set tile_type_id = 3 where tile_x = ? and tile_y = ?`,
                        [i, j]
                );
                // Each placement tile also needs to know who they are connected to
                await pool.query(
                    `Insert into placement_tile_group (ptg_tile_board_id, ptg_tile_x, ptg_tile_y, ptg_group) values (?, ?, ?, ?)`,
                        [boardIDIndex, i, j, 1]
                );
            }
        }

        // Add another group of placement tiles for player 2
        for (let i = 1; i <= 3; i++) {
            for (let j = 6; j <= 8; j++) {
                await pool.query(
                    `Update tile set tile_type_id = 3 where tile_x = ? and tile_y = ?`,
                        [i, j]
                );
                // Each placement tile also needs to know who they are connected to
                await pool.query(
                    `Insert into placement_tile_group (ptg_tile_board_id, ptg_tile_x, ptg_tile_y, ptg_group) values (?, ?, ?, ?)`,
                        [boardIDIndex, i, j, 2]
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