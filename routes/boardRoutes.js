const express = require('express');
const router = express.Router();
const Board = require('../models/boardsModel');
const auth = require("../middleware/auth");

router.get('/', auth.verifyAuth, async function (req, res, next) {
    try {
        if (!req.game || req.game.opponents.length == 0) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else {
            let result = await Board.getBoard(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;