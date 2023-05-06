const express = require('express');
const router = express.Router();
const World = require('../db_scripts/mapPopulate');
const Play = require("../models/playsModel");
const auth = require("../middleware/auth");
require("../db_scripts/mapPopulate");

router.get('/map', async function (req, res, next) {
    try {
        console.log("Get information about the map");
        let result = await Play.getMap();
        res.status(result.status).send(result.result);
    } catch (err) {
        console.log(err);
        res.status(result.status).send(result.result);
    }
});

router.get('/auth/teams', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Get information about the game teams");
        if (!req.game) {
            res.status(400).send({msg:"You are not in a game, please create or join a game"});
        }
        else {
            let result = await Play.getGameTeams(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(result.status).send(result.result);
    }
});

router.patch('/endturn', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play End Turn");
        if (!req.game) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else if (req.game.player.state.name != "Playing") {
            // Do not need to check if there are two players since in that case
            // the player will not be on Playing state
            res.status(400).send({msg: 
                "You cannot end turn since you are not currently on your turn"});
        } else {
            let result = await Play.endTurn(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch('/placementready', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play Placement Ready");
        if (!req.game) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else if (req.game.player.state.name != "Placement") {
            // Do not need to check if there are two players since in that case
            // the player will not be on Playing state
            res.status(400).send({msg: 
                "You cannot ready since you are not currently in placement mode"});
        } else {
            let result = await Play.endPlacement(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.patch('/move', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play move");

        if (req.body.catID === null || req.body.catID < 0) {
            res.status(400).send({msg:"You cannot the move character since the chosen character is not valid"});
        } else {
            let result = await Play.move(req.game, req.body.path, req.body.catID);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;