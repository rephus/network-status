var logFactory = require('../helpers/log.js');
var log = logFactory.create("models/network");

var set = function(ip, mac, status, callback) {

    var now = new Date().getTime();
  //  log.debug("Adding network "+ip+" (" + mac+ ") with name " + name);
    db.serialize(function() { //Execute sync requests
        db.run("INSERT INTO network (ip, mac, status, time) VALUES (?, ?, ?, ?)",[ip, mac, status, now]);
        db.get("select * from network ORDER BY id DESC LIMIT 1",[] , callback);
    });
};

var allIp = function(ip, callback) {
  db.all("select * from network WHERE ip = ?",[ip] , callback);
};

var allMac = function(mac, callback) {
  db.all("select * from network WHERE mac = ?",[mac] , callback);
};

var lastIp = function(ip, callback) {
  db.get("select * from network WHERE ip = ? order by id DESC LIMIT 1",[ip] ,callback);
};

var lastMac = function(mac, callback) {
  db.get("select * from network WHERE mac  = ? order by id DESC LIMIT 1",[mac] , callback);
};

var status = function(callback){
  db.all("SELECT * from network GROUP BY mac order by time DESC",[] , callback);
};

module.exports = {
    set: set,
    allIp: allIp,
    allMac: allMac,
    lastIp: lastIp,
    lastMac: lastMac,
    status: status
};
