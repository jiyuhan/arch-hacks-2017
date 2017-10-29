var noble = require('noble');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000});

// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

var isDatabaseConnected = false;

var peripheralId = 'f42e07780be14c878c360575c7d13e18';
var serviceUuid = '6e400001b5a3f393e0a9e50e24dcca9e';
var readUuid = '6e400003b5a3f393e0a9e50e24dcca9e';

var ax = 0.0;
var ay = 0.0;
var az = 0.0;
var gx = 0.0;
var gy = 0.0;
var gz = 0.0;


noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
    if(peripheral.advertisement.localName === "Concussion" || peripheral.advertisement.localName === "ARDUINO 101-391E") {

        peripheral.connect(function(error) {
            if(error) console.log(error);
            console.log("connected to", peripheral.advertisement.localName);
            noble.stopScanning();

            peripheral.discoverServices([serviceUuid], function(error, services) {
                var myservice = services[0];
                myservice.discoverCharacteristics(['6e400003b5a3f393e0a9e50e24dcca9e'], function(err, characteristics) {
                    var mycharacteristic = characteristics[0];
                    mycharacteristic.subscribe(function(error) {
                        console.log("subscribed!");
                        if(error) console.log(error);
                    });
                    console.log('saved readChar');
                    // Handle data events for characteristic
                    mycharacteristic.on('data', function(data, isNotification) {

                        var dataString = data.toString('ascii').split('<')[0];
                        var head = dataString.substring(0, 2);
                        var realData = dataString.substring(2);
                        if(head === 'ax') {
                            ax = parseFloat(realData);
                        } else if(head === 'ay') {
                            ay = parseFloat(realData);
                        } else if(head === 'az') {
                            az = parseFloat(realData);
                        } else if(head === 'gx') {
                            gx = parseFloat(realData);
                        } else if(head === 'gy') {
                            gy = parseFloat(realData);
                        } else if(head === 'gz') {
                            gz = parseFloat(realData);
                            // data format: player_id result timestamp
                            console.log(peripheral.advertisement.localName, '\t', gx, '\t', gy, '\t', gz, '\t', ax, '\t', ay, '\t', az, '\t', new Date().getTime());
                            var organizedData = new Date().getTime() + "," + Math.sqrt(ax * ax + ay * ay + az * az);
                            wss.broadcast(organizedData);
                        }
                    });
                });
            });
        });

        peripheral.once("disconnect", function() {
            console.log("disconneted");
            process.exit(0);
        });
    }
});
