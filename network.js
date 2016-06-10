//dependencies
var express = require("express");
var sqlite3 = require("sqlite3").verbose();

var logFactory = require('./helpers/log.js');
var log = logFactory.create("app");

var app = express();

var env = require('node-env-file');
try {
 env(process.cwd() + '/.env');
} catch(err){}

global.env = process.env;
//log.info("ENV settings ",global.env);

global.db = new sqlite3.Database(process.env.DB);

if (process.env.DEBUG) log.debug("Running node.js server in DEBUG mode");

/**
 *  == Load models ==
 */
var dbUtils = require('./models/db.js');
dbUtils.init(function(){});

/**
 *  == Load utils ==
 */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/*==========================
    Load controllers
 ========================**/
require('./controllers/network.js').routes(app);

/*==========================
    Load Background
 ========================**/

require('./background/network.js');

app.listen(process.env.PORT);
log.info("Server started in http://localhost:"+process.env.PORT);
