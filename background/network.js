var logFactory = require('../helpers/log.js');
var log = logFactory.create("background/network");

var networkService = require("../services/network.js");
var networkModel = require("../models/network.js");
var devicesModel = require("../models/devices.js");

var watch = function(){

  //networkService.arp(env.NETWORK, function(){});

  //log.info("Watching devices");
  networkService.arp(env.NETWORK, function(err, status) {
    if (err) log.error("Got error: "+err);
    else {
      //log.info("Got status of "+status.length+ " devices");

      devicesModel.all(env.NETWORK, function(error, devices) {
        if (error) log.error("Unable to get devices");
        else connectionChange(devices, status);
      });

    }
  });
};


var connectionChange = function(devices, status){

  log.info("Watching "+ devices.length + " devices");

  var connected = [], disconnected = [], newDevices = [];

  for (var d in devices){
    var device = devices[d];

    var isConnected = false;
    for (var s in status){
      var deviceStatus = status[s];
      if (deviceStatus.ip == device.ip) {
        status.splice(s,1);
        isConnected = true;
      }
    }

    if (isConnected) connected.push(device);
    else  disconnected.push(device);

    log.debug("Device " + device.mac + " connection status: " + isConnected);

    networkModel.set(device.ip, device.mac, isConnected, function(){});
  }

  // New devices
  for (var s2 in status){
    var newDevice = status[s2];
    newDevices.push(newDevice);
    devicesModel.set(newDevice.ip, newDevice.mac, newDevice.host, function(){});
    networkModel.set(newDevice.ip, newDevice.mac, true, function(){});

  }

  log.debug("Connection status\n"+
    "Connected devices: "+connected.length+"\n"+
    "Disconnected devices: " + disconnected.length+ "\n"+
    "New devices: " + newDevices.length+ "\n"
  );
};


watch();

setInterval(watch, 60 * 1000); //1 minutes
