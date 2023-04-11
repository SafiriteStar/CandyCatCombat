const pool = require("../config/database");
const fs = require("fs");

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
    constructor(width, height, wallGroups, placementGroups) {
        this.width = width;
        this.height = height;
        this.wallGroups = wallGroups;           // Array of TileTypeGroups
        this.placementGroups = placementGroups; // Array of TileTypeGroups
    }

    async create(boardIDIndex) {
        // Initially, fill everything with normal tiles
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                await pool.query(`Insert into tile (tile_x, tile_y, tile_type_id, tile_board_id) values (?, ?, ?, ?)`,
                    [i, j, 1, boardIDIndex]);
            }
        }

        // For every wall group
        for (let i = 0; i < this.wallGroups.length; i++) {
            // Add in the walls
            for (let j = this.wallGroups[i].startX; j < this.wallGroups[i].width + this.wallGroups[i].startX; j++) {
                for (let k = this.wallGroups[i].startY; k < this.wallGroups[i].height + this.wallGroups[i].startY; k++) {
                    await pool.query(`Update tile set tile_type_id = ? where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                        [2, j, k, boardIDIndex]);
                }
            }
        }

        // For every placement group
        for (let i = 0; i < this.placementGroups.length; i++) {
            // Add in the placement tile
            for (let j = this.placementGroups[i].startX; j < this.placementGroups[i].width + this.placementGroups[i].startX; j++) {
                for (let k = this.placementGroups[i].startY; k < this.placementGroups[i].height + this.placementGroups[i].startY; k++) {
                    await pool.query(`Update tile set tile_type_id = ? where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                        [3, j, k, boardIDIndex]);
                }
            }

            // Add in the group connection data to the group table
            for (let j = this.placementGroups[i].startX; j < this.placementGroups[i].width + this.placementGroups[i].startX; j++) {
                for (let k = this.placementGroups[i].startY; k < this.placementGroups[i].height + this.placementGroups[i].startY; k++) {
                    await pool.query(`Insert into placement_tile_group (ptg_tile_x, ptg_tile_y, ptg_tile_board_id, ptg_group) values (?, ?, ?, ?)`,
                        [j, k, boardIDIndex, this.placementGroups[i].group]);
                }
            }
        }
    }
}

async function runSQLFile(file) {
    let dbCreateData = fs.readFileSync('./db_scripts/' + file + '.sql', {encoding:'utf8', flag:'r'});
    // Remove the Unnecessary characters
    let createText = dbCreateData.toString().replace(/^#(.*)$/mg,'').replace(/\r|\n|\t/g, '');
    let createQueries = createText.split(';');
    for (let i = 0; i < createQueries.length; i++) {
        if (createQueries[i].length > 0) {
            if (createQueries[i].charAt(0) != '#' && createQueries[i].charAt(0) != '-') {
                await pool.query(createQueries[i]);
            }
        }
    }

    return true;
}

async function populateMap(fullReset, purgeDB) {
    // If we want to reset everything
    if (fullReset) {
        if (purgeDB) {
            console.log("Purging Database");
            await pool.query('drop database cccdb');
        }
        console.log("Creating tables and foreign keys...");
        await runSQLFile('create');
        console.log("Populating...");
        await runSQLFile('populate');
    }

    let [preMapCheck] = await pool.query(
        `Select *
        from tile`
    );

    if (!(preMapCheck.length > 0)) {
        console.log("- Map not found -");
        console.log("Creating map...");

        let boards = [
            // Placement Map
            new DatabaseMap(
                6, 1,                                               // Width & Height
                [],                                                 // Walls
                [   new TileTypeGroup(0, 0, 5, 0, 3, 0)   ]),       // Placement
            // Map 1
            new DatabaseMap(
                33, 20,                                             // Width & Height
                [   new TileTypeGroup(6, 10, 5, 4, 2, null)   ],   // Walls
                [                                                   // Placement
                    new TileTypeGroup(1, 1, 3, 3, 3, 1),
                    new TileTypeGroup(1, 6, 3, 3, 3, 2)
                ])
        ];

        for (let i = 0; i < boards.length; i++) {
            await boards[i].create(i + 1);
        }


        console.log("Map created!");
    }
    else {
        console.log("Map(s) Found");
    }
};

module.exports = populateMap;