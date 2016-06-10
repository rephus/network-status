var utils = require('../helpers/utils.js');
var network = require('../services/network.js');
var networkModel = require('../models/network.js');

var logFactory = require('../helpers/log.js');
var log = logFactory.create("controllers/network");
module.exports = {

  routes: function(app){

    app.get('/ping',function(req, res){

      var ip = req.query.i;
      network.ping(ip, function(err, status) {
          res.json({error: err, response: status});
        });
    });

    app.get('/nmap',function(req, res){

      var ip = req.query.i;
      if (!ip) ip = env.NETWORK;

      network.nmap(ip, function(err, status) {
          res.json({error: err, response: status});
        });
    });

    app.get('/arp',function(req, res){

      var ip = req.query.i;
      if (!ip) ip = env.NETWORK;

      network.arp(ip, function(err, status) {
          res.json({error: err, response: status});
        });
    });

    app.get('/status',function(req, res){

      var mac = req.query.m;

      var result = function(err, status) {
          log.info("Device status: ", status);
          res.json({error: err, response: status});
      };

      if (mac) {
        log.info("Requesting device status with mac "+mac);
        networkModel.lastMac(mac, result);
      }
      else networkModel.status(result);
    });
  }
};
