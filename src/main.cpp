#include <Arduino.h>
#include <Wire.h>
#include "DHT.h"
// REQUIRES the following Arduino libraries:
// - DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library
// - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor

#include "mywifi.h"

#define DHTPIN 5     // Digital pin connected to the DHT sensor
// Feather HUZZAH ESP8266 note: use pins 3, 4, 5, 12, 13 or 14 --
// Pin 15 can work but DHT must be disconnected during program upload.

// Uncomment whatever type you're using!
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// NOTE: If using a board with 3.3V logic like an Arduino Due connect pin 1
// to 3.3V instead of 5V!
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

// Initialize DHT sensor.
// Note that older versions of this library took an optional third parameter to
// tweak the timings for faster processors.  This parameter is no longer needed
// as the current DHT reading algorithm adjusts itself to work on faster procs.
DHT dht(DHTPIN, DHTTYPE);

// Sensitivity in deg Fahrenheit. The lower this number, the more sensitive it will be.
// Sensing getting up will be 50% less sensitive than this, since I've gotten more false
// "getting up" events than false "sitting down" events, and the temperature shift while
// getting up is often faster than sitting down.
float sensitivity = 1.5;

float lastLastHI = -1;
float lastHI = -1;
int sitting = -1; // 1 is sitting, 0 is standing, -1 is unintialized

void setup() {
  Serial.begin(9600);
  Serial.println("Starting wifi connection...");
  wifiConnect();
  Serial.println("Testing server connection..");
  int response = testServer();
  if (response % 100 == 2) {
    Serial.println("Server test successful, got 2xx response.");
  } else {
    Serial.print("Server test unsuccessful, got response code: ");
    Serial.println(response);
  }
  Serial.println("Starting DHT sensor...");
  dht.begin();
}

void loop() {
  // Read sensor once every 5 seconds
  delay(5000);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Compute heat index in Fahrenheit (the default)
  float hi = dht.computeHeatIndex(f, h);

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(f);
  Serial.print(F("°F  Heat index: "));
  Serial.print(hi);
  Serial.println(F("°F"));

  if (hi == -1 || lastLastHI == -1) {
    Serial.println("Taking initial temperature readings...");
  } else if (sitting != 1 && hi - lastLastHI >= sensitivity) {
    Serial.println("I (probably) sat down!");
    sitting = 1;
    notifyServer(true);
  } else if (sitting != 0 && lastLastHI - hi >= (sensitivity * 1.5)) {
    Serial.println("I (probably) got up!");
    sitting = 0;
    notifyServer(false);
  }

  lastLastHI = lastHI;
  lastHI = hi;
}
