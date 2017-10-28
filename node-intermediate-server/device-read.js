var noble = require('noble');
const util = require('util');



var peripheralId = 'f42e07780be14c878c360575c7d13e18';
var serviceUuid = '6e400001b5a3f393e0a9e50e24dcca9e';
var readUuid = '6e400003b5a3f393e0a9e50e24dcca9e';

var readChar = null;

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
    // console.log("found: ", peripheral.advertisement.localName, ". and peripheral.id: ", peripheral.id);
    // peripheral.id = "dfa4c6667ca14d778009d8675507813c";
    // if(peripheral.advertisement.localName === "Concussion" || peripheral.advertisement.localName === "ARDUINO 101-348F") {
    if(peripheral.id === peripheralId) {

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
                    // readChar = characteristic;
                    console.log('saved readChar');
                    // Handle data events for characteristic
                    mycharacteristic.on('data', function(data, isNotification) {

                        var dataString = data.toString('ascii').split('(')[0];
                        var head = dataString.charAt(0);
                        var realData = dataString.substring(1);


                        console.log(head, "\t", realData);
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
