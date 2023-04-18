const Play = require("../models/playsFunctionality/playsInit");
// Splitting these because having a massive file was giving me a headache
require("../models/playsFunctionality/playsUtils");
require("../models/playsFunctionality/playsStartGame");
require("../models/playsFunctionality/playsGetBoard");
require("../models/playsFunctionality/playsMove");
require("../models/playsFunctionality/playsEndPlacement");
require("../models/playsFunctionality/playsEndTurn");
require("../models/playsFunctionality/playsEndGame");

module.exports = Play;