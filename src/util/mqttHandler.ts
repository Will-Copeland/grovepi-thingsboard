
import {IClientOptions, Client, connect } from 'mqtt'
import apiKeys from '../../apiKeys';

export interface MqttHandlerProperties {

}


class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = '192.168.1.201';
    this.access_token = apiKeys.tempSensor1; // mqtt credentials if these are needed to connect
    this.password = 'YOUR_PASSWORD';
  }

  public mqttClient: Client;
  private host: string;
  private access_token: string;
  private password: string;



  connect() {

    const client:Client = connect(this.host, { username: this.access_token, password: this.password } as IClientOptions);
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)

    this.mqttClient = client as Client;
    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
      this.mqttClient.subscribe('v1/devices/me/attributes/response/+');
      this.mqttClient.publish('v1/devices/me/attributes/request/1', '{"clientKeys":"attribute1,attribute2", "sharedKeys":"shared1,shared2"}')
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('mytopic', {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      console.log('response.topic: ' + topic)
      console.log('response.body: ' + message.toString())
      client.end()
    });


    this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });
  }
  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish('v1/devices/me/telemetry', message);
  }
}

export default MqttHandler;