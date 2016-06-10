var logFactory = require('../helpers/log.js');
var log = logFactory.create("services/network");

var sys = require('sys');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = {

    ping:  function (ip, callback/*(error, url)*/ ) {

      var command = "ping -c 1 "+ip+ " | grep ttl ";
      log.debug("Executing sys command " + command);

      exec(command, function(er, stdout, stderr) {
           if (stderr) callback(er + stderr);
           else {
             var online = stdout.indexOf('ttl') >= 0;
             callback(undefined, online);
           }
       });
   },
   /*
SkyRouter.Home (192.168.2.1) en 3c:81:d8:aa:75:f7 [ether] en eth0
? (192.168.2.152) en 00:0c:29:4d:17:92 [ether] en eth0
Unknown (192.168.2.172) en 00:0c:29:06:3b:97 [ether] en eth0
*/
   arp:  function (ip, callback/*(error, url)*/ ) {

     var command = "arp -a | grep "+ip;
     log.debug("Executing sys command " + command);

     exec(command, function(er, stdout, stderr) {
          if (stderr) callback(er + stderr);
          else {
            //console.log("arp scan finished: "+ stdout);
            var lines = stdout.trim().split('\n');
            var devices = [];
            for (var i= 0 ; i < lines.length; i++){
              var line = lines[i];
              var info = line.split(' ');

              var host = info[0];
              var ip = info[1].replace('(', '').replace(')', '');
              var mac = info[3];

              devices.push({ip: ip, host: host, mac: mac});

            }
            callback(undefined, devices);
          }
      });
  },
/*
Starting Nmap 6.40 ( http://nmap.org ) at 2014-07-01 19:35 BST
Nmap scan report for SkyRouter.Home (192.168.2.1)
Host is up (0.00059s latency).
Nmap scan report for Unknown (192.168.2.100)
Host is up (0.000058s latency).
Nmap done: 256 IP addresses (14 hosts up) scanned in 2.45 seconds
*/
   nmap:  function (ip, callback/*(error, url)*/ ) {

     var command = "nmap -sP "+ip+"| grep 'Nmap scan report for'";
     log.debug("Executing sys command " + command);
     exec(command, function(er, stdout, stderr) {
        if (stderr) callback(er + stderr);
        else {
          //console.log("Nmap scan finished: "+ stdout);
          var lines = stdout.trim().split('\n');
          var devices = [];
          for (var i= 0 ; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line){
              var info = line.split('Nmap scan report for ')[1].split(' ');

              //Can be the ip directly
              if (isIp(info[0])) devices.push({ip: info[0]});
              else { //Something like: SkyRouter.Home (192.168.2.1)
                var host = info[0];
                var ip = info[1].replace('(', '').replace(')', '');
                devices.push({ip: ip, host: host});
              }
            }
          }
          callback(undefined, devices);
        }
      });
   }
};

var isIp = function(ip){
  return ip.split('.').length == 4;
};
