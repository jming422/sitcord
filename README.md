Sitcord
===

Enter/leave a Discord channel automatically when you enter/leave your chair!

A fun (and hopefully helpful) hackathon project to automate something I kept forgetting to do.


## Required hardware
 - Any Arduino-compatible microcontroller should be fine, but this project is preconfigured for an Espressif ESP32 WROOM-32D
 - Any DHT temperature/humidity sensor should also be fine, but this project is preconfigured for a DHT11 sensor
 - One 10K resistor
 - Some wires and a small breadboard (breadboard optional but it's much easier if you have one)
 - A local Wi-Fi network (My model of ESP32 doesn't support 5GHz, so make sure your network and microcontroller are compatible)


## Required software
 - PlatformIO extension for Visual Studio Code with the following Libraries installed:
   - DHT sensor library by Adafruit
   - Adafruit Unified Sensor by Adafruit
 - If you're on macOS, you'll need [this driver](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers). I can't say if you'll need it or not on Windows/Linux, but that page has downloads for those OSes too.
 - A reasonably recent version of Node.js
 - The Discord desktop client


## Environment Variables
You can either set these in your environment like usual, or `dotenv` will load them from `server/.env` for you.
 - `DISCORD_DEBUG_PORT` - *Required.* This is the remote debugging port that Discord is listening on. See _Enabling Discord Debugging_ below.
 - `DISCORD_SERVER_NAME` - *Required.* This is the name of the Discord server you want to connect/disconnect to.
 - `DISCORD_CHANNEL_NAME` - Defaults to `General`. This is the name of the desired voice channel in the above server.
 - `SITCORD_PORT` - Defaults to `12345`. This is the port you would like you local Sitcord server to listen on. Your ESP32 will connect to this port to send sit/stand statuses.


## Attribution
I grabbed a lot of the DHT-reading code from the example included in Adafruit's DHT sensor library, so thanks to them for that!
