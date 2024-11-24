from flask import Flask, render_template, jsonify
from flask_mqtt import Mqtt
from flask_pymongo import PyMongo
from datetime import datetime, timezone, timedelta
import logging

app = Flask(__name__)


# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://mongo:27017/device_db"
mongo = PyMongo(app)
collection = mongo.db.device_data

# MQTT Configuration
app.config["MQTT_BROKER_URL"] = "192.168.137.1"  #192.168.137.1 router
app.config["MQTT_BROKER_PORT"] = 1883
app.config["MQTT_CLIENT_ID"] = "flask_mqtt_client"
app.config["MQTT_KEEPALIVE"] = 60
app.config["MQTT_TLS_ENABLED"] = False
app.config["MQTT_USERNAME"] = "server"
app.config["MQTT_PASSWORD"] = "server"
mqtt = Mqtt(app)

logging.basicConfig(level=logging.INFO)

topics = ["Window monitor", "Window info", "This device"]

def send_data_to_mongodb(topic, message):
    now = datetime.now(tz=timezone(timedelta(hours=1)))  
    data = {
        "topic": topic,
        "message": message,
        "timestamp": now  
    }
    collection.insert_one(data)
    logging.info(f"Data inserted with topic: {topic} | Message: {message}")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode()
    logging.info(f"Received message on {topic}: {payload}")
    send_data_to_mongodb(topic, payload)

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    for topic in topics:
        mqtt.subscribe(topic)
        logging.info(f"Subscribed to {topic}")

@app.route('/messages')
def get_messages():
    messages = list(collection.find().sort("timestamp", -1))
    for message in messages:
        message["_id"] = str(message["_id"])
    return jsonify(messages)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
