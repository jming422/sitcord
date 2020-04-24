#include "mywifi.h"
#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include "secrets.h"

HTTPClient client;

int testServer() {
    String host = serverHost + "/";
	Serial.print("Trying to GET ");
	Serial.println(host);

    String token = "Bearer ";
    token.concat(apikey);

    client.begin(host);
    // client.addHeader("Authorization", token);
	int responseCode = client.GET();
    String response = client.getString();
	client.end();

	Serial.print("Got response code: ");
	Serial.println(responseCode);
    Serial.print("Got response body: ");
    Serial.println(response);

    return responseCode;
}

int notifyServer(bool sitting) {
	String host = serverHost;
    host.concat(sitting ? "/sit" : "/stand");
	Serial.print("Trying to POST ");
	Serial.println(host);

    String token = "Bearer ";
    token.concat(apikey);

	client.begin(host);
    // client.addHeader("Content-Type", "application/json");
    // client.addHeader("Authorization", token);
	int responseCode = client.POST("");
    String response = client.getString();
	client.end();

	Serial.print("Got response code: ");
	Serial.println(responseCode);
    Serial.print("Got response body: ");
    Serial.println(response);

    return responseCode;
}

void wifiConnect(void) {
    // Connect to WiFi network
    Serial.print("Connecting to ");
    Serial.print(ssid);
    WiFi.begin(ssid, password);

    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("Connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}
