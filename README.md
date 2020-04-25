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

 - PlatformIO extension for Visual Studio Code with the following Libraries installed (you can use PlatformIO's UI to install them):
   - DHT sensor library by Adafruit
   - Adafruit Unified Sensor by Adafruit
 - If you're on macOS and intend to use an ESP32, you'll need [this driver](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers). I can't say if you'll need it or not on Windows/Linux, but that page has downloads for those OSes too.
 - A reasonably recent version of [Node.js](https://nodejs.org/en/)
 - The [Discord desktop client](https://discordapp.com/download)


## Environment variables

You can either set these in your environment like usual, or `dotenv` will load them from `server/.env` for you.
 - `DISCORD_DEBUG_PORT` - **Required.** This is the remote debugging port that Discord is listening on. See [Enabling Discord Debugging](#enabling-discord-debugging) below.
 - `DISCORD_SERVER_NAME` - **Required.** This is the name of the Discord server you want to connect/disconnect to.
 - `DISCORD_CHANNEL_NAME` - Defaults to `General`. This is the name of the desired voice channel in the above server.
 - `SITCORD_PORT` - Defaults to `12345` (because why not!). This is the port you would like you local Sitcord server to listen on. Your ESP32 will connect to this port to send sit/stand statuses.


## Getting started

1. Make sure you've got all the [required hardware](#required-hardware) and [required software](#required-software)
1. Wire the components as described [in this comment](https://github.com/jming422/sitcord/blob/3cb9d12a4f331b675bfbd0cc6f73ea3e224be44e/src/main.cpp#L19-L24)
1. Start Discord with remote debugging enabled by passing in `--remote-debugging-port=<PORT>` ([more detailed instructions](#enabling-discord-debugging) below)
1. Open a terminal, navigate to the `server` directory, then run `npm install && npm start`
1. Open this repo's as a project in PlatformIO
1. Create a new file, `include/secrets.h`, and write this in it, putting in your Wi-Fi info:
    - ```
      #include <Arduino.h>
      
      const String serverHost = "http://YOUR_LAN_IP:12345"; // Replace 12345 if you set a custom SITCORD_PORT
      const char* ssid = "YOUR_WIFI_SSID_HERE";
      const char* password = "YOUR_WIFI_PASSWORD";
      ```
1. Connect your microcontroller to your laptop via USB
1. Use PlatformIO's "Upload" button to write this project's code to your microcontroller
1. All done!


## Enabling Discord Debugging

You can use any available port for Discord's debug listener, but whichever one you choose, be sure to set it as `DISCORD_DEBUG_PORT` in your environment (or `server/.env` file).

### macOS
If you installed Discord regularly, you should be able to launch Discord from your terminal and pass in arguments like this:
```
/Applications/Discord.app/Contents/MacOS/Discord --remote-debugging-port=123123
```
If you use the Discord PTB, the path is only slightly different:
```
/Applications/Discord\ PTB.app/Contents/MacOS/Discord\ PTB --remote-debugging-port=123123
```

Now, it isn't super convenient to launch Discord from terminal every time, especially not if you need to leave the terminal running. So, I recommend creating an Automator Application and giving it one action, Run Shell Script, with a line like this:
```
/Applications/Discord.app/Contents/MacOS/Discord --remote-debugging-port=123123 > /tmp/discord.log 2> /tmp/discord.err &
```
That will route Discord's logs and errors to files in your `/tmp` directory, which can be convenient, and it'll background the process so your Automator script doesn't have to leave a little spinny gear in your menu bar.

### Windows/Linux
Sorry, I haven't gotten around to testing this method on other OSes yet, but since the Discord client is an Electron app pretty much everywhere, the process should be basically the same:
1. Locate the Discord binary on your computer
1. Figure out how to pass it command line arguments
1. Give it the `--remote-debugging-port` argument with a port of your choice


## Attribution

I grabbed a lot of the DHT-reading code from the example included in Adafruit's DHT sensor library, so thanks to them for that!
