var logFactory = require('../helpers/log.js');
var log = logFactory.create("models/devices");

var set = function(ip, mac, name, callback) {

    var now = new Date().getTime();
    log.debug("Adding device "+ip+" (" + mac+ ") with name " + name);
    db.serialize(function() { //Execute sync requests
        db.run("INSERT OR IGNORE INTO devices (ip, mac, name, created) VALUES (?, ?, ?, ?)",[ip, mac, name, now]);
        get(mac, callback);
    });
};

var get = function(mac, callback) {
  db.get("select * from devices WHERE mac = ?",[mac] , callback);
};

var all = function(mac, callback) {
  db.all("select * from devices",[] , callback);
};

/* @deprecated: use the one in network*/
var status = function(mac, callback) {
  db.all("select d.mac mac ,d.ip ip ,d.name name ,n.status status from devices d join (SELECT * from network order by time DESC) n on n.mac = d.mac;",
    [] , callback);
};
module.exports = {
    set: set,
    get: get,
    all: all,
    status: status
};
