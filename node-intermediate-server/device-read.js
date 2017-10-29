var noble = require('noble');
var axios = require('axios');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'phly.c7jx0v6pormd.us-east-1.rds.amazonaws.com',
  user: 'phly',
  password: 'phlyisthebest',
  port: '3306',
  database : 'phly'
});

var isDatabaseConnected = false;

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  isDatabaseConnected = true;
});

var peripheralId = 'f42e07780be14c878c360575c7d13e18';
var serviceUuid = '6e400001b5a3f393e0a9e50e24dcca9e';
var readUuid = '6e400003b5a3f393e0a9e50e24dcca9e';

var x = 0.0;
var y = 0.0;
var z = 0.0;


noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
    if(peripheral.advertisement.localName === "Concussion") {

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

                        var dataString = data.toString('ascii').split('(')[0];
                        var head = dataString.charAt(0);
                        var realData = dataString.substring(1);
                        if(head === 'x') {
                            x = parseFloat(realData);
                        } else if(head === 'y') {
                            y = parseFloat(realData);
                        } else if(head === 'z') {
                            z = parseFloat(realData);
                            var result = Math.sqrt(x * x + y * y + z * z);
                            // data format: player_id result timestamp
                            console.log(peripheral.advertisement.localName, '\t', result, '\t', new Date().getTime());
                            if(isDatabaseConnected) {
                              var sql = "INSERT INTO accel_data (player_id, game_id, result, time_stamp) VALUES ?";
                              var values = [
                                  [1, 2, result, new Date().getTime()]
                              ];
                              connection.query(sql, [values], function (err, result) {
                                if (err) throw err;
                              });
                            }
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
