#include <CurieBLE.h>

#include <Wire.h>
#include "CurieIMU.h"

BLEService batteryService("6e400001b5a3f393e0a9e50e24dcca9e"); // BLE Battery Service

// BLE Battery Level Characteristic"
BLECharacteristic batteryLevelChar("6e400003b5a3f393e0a9e50e24dcca9e",  // standard 16-bit characteristic UUID
    BLEWrite | BLERead | BLENotify, 20);     // remote clients will be able to
// get notifications if this characteristic changes

int oldBatteryLevel = 0;  // last battery level reading from analog input
long previousMillis = 0;  // last time the battery level was checked, in ms

void setup() {
  Serial.begin(9600);    // initialize serial communication

  // initialize device
  Serial.println("Initializing IMU device...");
  CurieIMU.begin();

  // Set the accelerometer range to 250 degrees/second
  CurieIMU.setGyroRange(250);

  // Set the accelerometer range to 16 G
  CurieIMU.setAccelerometerRange(16);
  /* Set a local name for the BLE device
     This name will appear in advertising packets
     and can be used by remote devices to identify this BLE device
     The name can be changed but maybe be truncated based on space left in advertisement packet
  */
  BLE.setLocalName("Concussion");
  BLE.setAdvertisedService(batteryService);  // add the service UUID
  batteryService.addCharacteristic(batteryLevelChar); // add the battery level characteristic
  BLE.addService(batteryService);   // Add the BLE Battery service
  batteryLevelChar.setValue((const unsigned char *)"x0.1111111", 20);   // initial value for this characteristic

  // begin initialization
  BLE.begin();


  /* Start advertising BLE.  It will start continuously transmitting BLE
     advertising packets and will be visible to remote BLE central devices
     until it receives a new connection */

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(13, HIGH);

    // check the battery level every 200ms
    // as long as the central is still connected:
    while (central.connected()) {
      long currentMillis = millis();
      // if 200ms have passed, check the battery level:
      if (currentMillis - previousMillis >= 50) {
        previousMillis = currentMillis;
        updateBatteryLevel(currentMillis);
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(13, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}

void updateBatteryLevel(long currentMills) {
  float gx, gy, gz; //scaled Gyro values
  float ax, ay, az;   //scaled accelerometer values
  char buffer[20];
  
  // read gyro measurements from device, scaled to the configured range
  CurieIMU.readGyroScaled(gx, gy, gz);

  sprintf(buffer, "gx%f", gx);
  Serial.println(buffer);
  batteryLevelChar.setValue((unsigned char *)buffer, 20);  // and update the battery level characteristic
  sprintf(buffer, "gy%f", gy);
  Serial.println(buffer);
  batteryLevelChar.setValue((unsigned char *)buffer, 20);  // and update the battery level characteristic
  sprintf(buffer, "gz%f", gz);
  Serial.println(buffer);
  batteryLevelChar.setValue((unsigned char *)buffer, 20);  // and update the battery level characteristic



  // read accelerometer measurements from device, scaled to the configured range
  CurieIMU.readAccelerometerScaled(ax, ay, az);

  // read accelerometer measurements from device, scaled to the configured range
  CurieIMU.readAccelerometerScaled(ax, ay, az);
  sprintf(buffer, "ax%f", ax);
  Serial.println(buffer);
  batteryLevelChar.setValue((unsigned char *)buffer, 20);  // and update the battery level characteristic
  sprintf(buffer, "ay%f", ay);
  Serial.println(buffer);
  batteryLevelChar.setValue((unsigned char *)buffer, 20);  // and update the battery level characteristic
  sprintf(buffer, "az%f", az);
  Serial.println(buffer);
  batteryLevelChar.setValue((unsigned char *)buffer, 20);  // and update the battery level characteristic
}
