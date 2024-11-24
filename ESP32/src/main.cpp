#include <WiFi.h>
#include <PubSubClient.h>

// WiFi 
const char* ssid = "Horda";
const char* password = "221103030702>69";

// MQTT broker 
const char* mqtt_server = "192.168.0.212"; //IP PC address
const int mqtt_port = 1883;      
const char* mqtt_topic_publish = "Window monitor";

// Topics
const char* topic1 = "Window monitor";
const char* topic2 = "This device";
const char* topic3 = "Window info";

// MQTT credentials
const char* mqtt_username = "esp32";
const char* mqtt_password = "esp32";

WiFiClient espClient;
PubSubClient client(espClient);

bool wasConnected = false; 
#define WINDOW_SENSOR_PIN  19  
#define LED  15  

int lastWindowState; 

void setup_wifi() {
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
    if (!client.connected()) {
        Serial.print("Attempting MQTT connection...");

        if (client.connect("ESP32ClientHorda", mqtt_username, mqtt_password)) {
            Serial.println("connected");
            client.subscribe(topic1);
            client.subscribe(topic2);
            client.subscribe(topic3);
            wasConnected = true;
        } else {
            Serial.println("failed, reconnecting");
        }
    }
}

void messageReceived(char* topic, byte* payload, unsigned int length) {
    String message;
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.print("Message received from topic: ");
    Serial.print(topic);
    Serial.print(": ");
    Serial.println(message);

    if (strcmp(topic, topic2) == 0) {
        if (message == "On") {
            digitalWrite(LED, HIGH);
        } else if (message == "Off") {
            digitalWrite(LED, LOW); 
        } else if (message == "check") {
            if (digitalRead(LED) == HIGH) {
                client.publish(topic3, "On");  
            } else {
                client.publish(topic3, "Off");
            }

            int windowState = digitalRead(WINDOW_SENSOR_PIN);
            if (windowState == HIGH) {
                client.publish(mqtt_topic_publish, "open");
            } else {
                client.publish(mqtt_topic_publish, "closed");
            }
        }
    }
}

void setup() {
    Serial.begin(9600);
    setup_wifi();
    client.setServer(mqtt_server, mqtt_port);
    pinMode(WINDOW_SENSOR_PIN, INPUT_PULLUP);
    pinMode(LED, OUTPUT);
    client.setCallback(messageReceived);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    int windowState = digitalRead(WINDOW_SENSOR_PIN);
    if (windowState != lastWindowState) {
        if (windowState == HIGH) {
            digitalWrite(LED, LOW);
            Serial.println("Opened");
            client.publish(mqtt_topic_publish, "open");
            client.publish(topic3, "Off");
        } else {
            digitalWrite(LED, HIGH);
            Serial.println("Closed");
            client.publish(mqtt_topic_publish, "closed");
            client.publish(topic3, "On"); 
        }
        lastWindowState = windowState; 
    }

    delay(10); 
}
