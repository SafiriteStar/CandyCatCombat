const { argv } = require('node:process');
require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var morgan = require('morgan');

var app = express();
app.use(cookieSession({
  name: 'session',
  secret: process.env.COOKIE_SECRET,
  // Cookie Options
  maxAge: 6 * 60 * 60 * 1000 // 6 hours
}))

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const usersRouter = require("./routes/usersRoutes");
const gamesRouter = require("./routes/gamesRoutes");
const playsRouter = require("./routes/playsRoutes");
const scoresRouter = require("./routes/scoresRoutes");
const World = require('./db_scripts/mapPopulate');
const Play = require('./models/playsModel');

app.use("/api/users",usersRouter);
app.use("/api/games",gamesRouter);
app.use("/api/plays",playsRouter);
app.use("/api/scores",scoresRouter);

// when we don't find anything
app.use((req, res, next) => {
  res.status(404).send({msg:"No resource or page found."});
});

// When we find an error (means it was not treated previously)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send(err);
});

// After we start the sever, we want to add in the maps to the database if they aren't in there already
require("./db_scripts/mapPopulate");

class Argument {
  constructor(command) {
    this.command = command;
    this.execute = false;
  }
}

let validArguments = [
  new Argument("-r"), // Reset database tables
  new Argument("-p"), // Purge database
  new Argument("-k"), // Kill process after setting map
];

for (let i = 0; i < argv.length; i++) {
  for (let j = 0; j < validArguments.length; j++) {
    if (argv[i] == validArguments[j].command) {
      validArguments[j].execute = true;
    }
  }
}

function worldStart() {
  return new Promise((resolve) => {
    resolve(Play.setWorldData(World.createWorld, validArguments[0].execute, validArguments[1].execute, validArguments[2].execute));
  }).then(() => {
    if (validArguments[2].execute) {
      process.kill(0);
    }
    else {
      const port = parseInt(process.env.port || '8080');
      app.listen(port,function() {
        console.log("Server running at http://localhost:" + port);
      });
    }
  });
}

worldStart();