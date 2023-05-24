const pool = require("../config/database");
const fs = require("fs");

function isEven(n) {
    return n % 2 == 0;
}

function isOdd(n) {
    return Math.abs(n % 2) == 1;
}

async function runSQLFile(file) {
    let dbCreateData = fs.readFileSync('./db_scripts/' + file + '.sql', {encoding:'utf8', flag:'r'});
    // Remove the unnecessary characters and comments
    let createText = dbCreateData.toString().replace(/^#(.*)$/mg,'').replace(/\r|\n|\t/g, '');
    // Divide into individual queries
    let createQueries = createText.split(';');
    // Run the individual queries
    for (let i = 0; i < createQueries.length; i++) {
        if (createQueries[i].length > 0) {
            if (createQueries[i].charAt(0) != '#' && createQueries[i].charAt(0) != '-') {
                await pool.query(createQueries[i]);
            }
        }
    }

    return true;
}

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
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                await pool.query(`Insert into tile (tile_x, tile_y, tile_type_id, tile_board_id) values (?, ?, ?, ?)`,
                    [x, y, 1, boardIDIndex]);
            }
        }

        // For every wall group
        for (let i = 0; i < this.wallGroups.length; i++) {
            // Add in the walls
            for (let x = this.wallGroups[i].startX; x < this.wallGroups[i].width + this.wallGroups[i].startX; x++) {
                for (let y = this.wallGroups[i].startY; y < this.wallGroups[i].height + this.wallGroups[i].startY; y++) {
                    await pool.query(`Update tile set tile_type_id = ? where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                        [2, x, y, boardIDIndex]);
                }
            }
        }

        // Generic add tile function to save space
        async function addConnection(originX, originY, targetX, targetY) {
            await pool.query(`Insert into tile_connection (
                tcn_origin_x, tcn_origin_y, tcn_origin_board_id,
                tcn_target_x, tcn_target_y, tcn_target_board_id)
                values (?, ?, ?, ?, ?, ?)`,
                    [originX, originY, boardIDIndex, targetX, targetY, boardIDIndex]);
        }

        // For every tile
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let upLimit = false;
                let downLimit = false;
                let leftLimit = false;
                let rightLimit = false;
                let even = isEven(x);
                // Are we at the very top?
                if (y != this.height - 1) {
                    // Nope
                    // Add a connection above
                    await addConnection(x, y, x, y + 1);
                }
                else {
                    upLimit = true;
                }
                
                // Are we at the very bottom?
                if (y != 0) {
                    // Nope
                    // Add a connection below
                    await addConnection(x, y, x, y - 1);
                }
                else {
                    downLimit = true;
                }
                
                // Are we to the very left?
                if (x != 0) {
                    // Nope
                    // Add one to the left
                    await addConnection(x, y, x - 1, y);

                    // Are we even and is there stuff above us?
                    if (even && !upLimit) {
                        // Yes
                        // Add one to the top left
                        await addConnection(x, y, x - 1, y + 1);
                    }
                    // Are we odd and is there stuff below us?
                    else if (!even && !downLimit) {
                        // Yes
                        // Add one to the bottom left
                        await addConnection(x, y, x - 1, y - 1);
                    }
                }
                else {
                    leftLimit = true;
                }
                
                // Are we to the very right?
                if (x != this.width - 1) {
                    // Nope
                    // Add one to the right
                    await addConnection(x, y, x + 1, y);

                    // Are we even and is there stuff above us?
                    if (even && !upLimit) {
                        // Yes
                        // Add one to the top left
                        await addConnection(x, y, x + 1, y + 1);
                    }
                    // Are we odd and is there stuff below us?
                    else if (!even && !downLimit) {
                        // Yes
                        // Add one to the bottom left
                        await addConnection(x, y, x + 1, y - 1);
                    }
                }
                else {
                    rightLimit = true;
                }
            }
        }

        // For every placement group
        for (let i = 0; i < this.placementGroups.length; i++) {
            // Add in the placement tile
            for (let x = this.placementGroups[i].startX; x < this.placementGroups[i].width + this.placementGroups[i].startX; x++) {
                for (let y = this.placementGroups[i].startY; y < this.placementGroups[i].height + this.placementGroups[i].startY; y++) {
                    await pool.query(`Update tile set tile_type_id = ? where tile_x = ? and tile_y = ? and tile_board_id = ?`,
                        [3, x, y, boardIDIndex]);
                }
            }

            // Add in the group connection data to the group table
            for (let x = this.placementGroups[i].startX; x < this.placementGroups[i].width + this.placementGroups[i].startX; x++) {
                for (let y = this.placementGroups[i].startY; y < this.placementGroups[i].height + this.placementGroups[i].startY; y++) {
                    await pool.query(`Insert into placement_tile_group (ptg_tile_x, ptg_tile_y, ptg_tile_board_id, ptg_group) values (?, ?, ?, ?)`,
                        [x, y, boardIDIndex, this.placementGroups[i].group]);
                }
            }
        }
    }
}

async function getMapData(mapID) {
    // Get the width and height
    [[dbMapData]] = await pool.query(
        `Select brd_id, max(tile_x) + 1 as "width", max(tile_y) + 1 as "height"
        from board, tile
        where tile_board_id = brd_id and brd_id = ?`,
            [mapID]);
    
    // Get all the tiles
    [dbTileData] = await pool.query(
        `Select tile_x as "x", tile_y as "y", tile_type_id as "type", tile_board_id as "map", null as "connections"
        from tile
        where tile_board_id = ?`,
            [mapID]);
    
    // Get all the placement tile data
    [dbPlacementTileData] = await pool.query(
        `Select ptg_tile_x as "x", ptg_tile_y as "y", ptg_group as "group"
        from placement_tile_group
        where ptg_tile_board_id = ?`,
            [mapID]);

    let map = {}
    map.width = dbMapData.width;
    map.height = dbMapData.height;
    map.tiles = [];

    // Index for db tile array
    let tileIndex = 0;

    // Add in all the tiles
    for (let x = 0; x < map.width; x++) {
        map.tiles[x] = [];
        for (let y = 0; y < map.height; y++) {
            map.tiles[x][y] = dbTileData[tileIndex];
            // Add in connections for later
            map.tiles[x][y].connections = [];
            tileIndex++;
        }
    }

    // Get all tile connections
    [dbTileConnections] = await pool.query(
        `Select tcn_origin_x as "originX", tcn_origin_y as "originY", tcn_target_x as "targetX", tcn_target_y as "targetY"
        from tile_connection
        where tcn_origin_board_id = tcn_target_board_id and tcn_origin_board_id = ?`,
            [mapID]);
    
    // Add all tile connections
    for (let i = 0; i < dbTileConnections.length; i++) {
        // At the tile at originX and originY, add a new connection to the array
        map.tiles[dbTileConnections[i].originX][dbTileConnections[i].originY].connections.push({
            x:dbTileConnections[i].targetX,
            y:dbTileConnections[i].targetY,
            map:mapID
        });
    }

    // After adding all the tiles we need to adjust the placement tiles so that they know what group they are in
    for (let i = 0; i < dbPlacementTileData.length; i++) {
        map.tiles[dbPlacementTileData[i].x][dbPlacementTileData[i].y].group = dbPlacementTileData[i].group;
    }

    return map;
}

class World {
    static async getWorld() {
        let world = {
            maps:[]
        }
    
        let [boardsCheck] = await pool.query(`Select * from board`);
    
        for (let i = 0; i < boardsCheck.length; i++) {
            world.maps[i] = await getMapData(i + 1);
        }
    
        return world;
    }

    static async createWorld(fullReset, purgeDB) {
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
                    1, 6,                                               // Width & Height
                    [],                                                 // Walls
                    [   new TileTypeGroup(0, 0, 1, 6, 3, 0)   ]),       // Placement
                // Map 1
                new DatabaseMap(
                    33, 20,                                             // Width & Height
                    [   // <-------------------- Walls -------------------->
                        new TileTypeGroup(9, 0, 7, 1, 2, null),         // ^
                        new TileTypeGroup(11, 1, 3, 1, 2, null),        // |
                        new TileTypeGroup(11, 2, 3, 1, 2, null),        // |
                        new TileTypeGroup(12, 3, 1, 1, 2, null),        // |
                        new TileTypeGroup(12, 4, 1, 1, 2, null),        // | Bottom Pillars
                        new TileTypeGroup(17, 0, 7, 1, 2, null),        // |
                        new TileTypeGroup(19, 1, 3, 1, 2, null),        // |
                        new TileTypeGroup(19, 2, 3, 1, 2, null),        // |
                        new TileTypeGroup(20, 3, 1, 1, 2, null),        // |
                        new TileTypeGroup(20, 4, 1, 1, 2, null),        // v
                        new TileTypeGroup(6, 5, 3, 1, 2, null),         // ^
                        new TileTypeGroup(7, 6, 1, 1, 2, null),         // | Bottom Duds 
                        new TileTypeGroup(24, 5, 3, 1, 2, null),        // |
                        new TileTypeGroup(25, 6, 1, 1, 2, null),        // v
                        new TileTypeGroup(9, 12, 3, 1, 2, null),        // ^
                        new TileTypeGroup(10, 11, 1, 1, 2, null),       // | Top Duds
                        new TileTypeGroup(21, 12, 3, 1, 2, null),       // |
                        new TileTypeGroup(22, 11, 1, 1, 2, null),       // v
                        new TileTypeGroup(16, 7, 1, 1, 2, null),        // ^
                        new TileTypeGroup(15, 8, 3, 1, 2, null),        // |
                        new TileTypeGroup(15, 9, 1, 1, 2, null),        // |
                        new TileTypeGroup(17, 9, 1, 1, 2, null),        // | Center Pieces
                        new TileTypeGroup(15, 11, 3, 1, 2, null),       // |
                        new TileTypeGroup(15, 12, 3, 1, 2, null),       // |
                        new TileTypeGroup(14, 13, 2, 1, 2, null),       // |
                        new TileTypeGroup(17, 13, 2, 1, 2, null),       // v
                        new TileTypeGroup(10, 16, 1, 1, 2, null),       // ^
                        new TileTypeGroup(8, 17, 3, 1, 2, null),        // |
                        new TileTypeGroup(6, 18, 7, 1, 2, null),        // |
                        new TileTypeGroup(4, 19, 11, 1, 2, null),       // | Top Chunks
                        new TileTypeGroup(22, 16, 1, 1, 2, null),       // |
                        new TileTypeGroup(22, 17, 3, 1, 2, null),       // |
                        new TileTypeGroup(20, 18, 7, 1, 2, null),       // |
                        new TileTypeGroup(18, 19, 11, 1, 2, null),      // |
                        new TileTypeGroup(14, 18, 1, 1, 2, null),       // |
                        new TileTypeGroup(18, 18, 1, 1, 2, null),       // v
                        new TileTypeGroup(0, 19, 3, 1, 2, null),        // ^
                        new TileTypeGroup(0, 18, 1, 1, 2, null),        // | Top Corners
                        new TileTypeGroup(30, 19, 3, 1, 2, null),       // |
                        new TileTypeGroup(32, 18, 1, 1, 2, null),       // v
                    ],
                    [   // <------------------ Placement ------------------>
                        new TileTypeGroup(3, 7, 3, 6, 3, 1),            // ^ Player 1
                        new TileTypeGroup(4, 6, 1, 1, 3, 1),            // v

                        new TileTypeGroup(27, 7, 3, 6, 3, 2),           // ^ Player 2
                        new TileTypeGroup(28, 6, 1, 1, 3, 2)            // v
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

        return await World.getWorld();
    }
}

module.exports = World;