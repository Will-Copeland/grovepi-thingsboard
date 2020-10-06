import mqtt, { MqttClient } from "mqtt";
import { DeviceConfig } from "./device";

export interface Transmitter {
  connect: (config: TransmitterConfig, cb: () => void) => void;
  client?: MqttClient;
  send: (message: { [key: string]: string | number}, cb: () => void) => void;
}

export interface TransmitterConfig {
    host: string;
    port: string;
}


class DeviceTransmitter {
  constructor(transmitterConfig: TransmitterConfig, deviceConfig: DeviceConfig) {
    const connectOptions = {...transmitterConfig, username: deviceConfig.accessToken };
    this.transmitterConfig = transmitterConfig;

    console.log(`Trying to connect to the MQTT broker at ${transmitterConfig.host} on port ${transmitterConfig.port}`);
    this.client = mqtt.connect(connectOptions);

    this.client.on('connect', () => {
      console.log(`Connected successfully to the MQTT broker at ${transmitterConfig.host} on port ${transmitterConfig.port}`);
      this.client.subscribe("v1/devices/me/rpc/request/+")
    });

    this.client.on('error', (err) => {
      console.error(`An error occurred. ${err}`);
    });
  }

  public client: MqttClient;
  public transmitterConfig: TransmitterConfig;

  public send(topic: string, message: { [key: string]: string | number}, cb: (err: unknown) => void): void {
    this.client.publish(topic, JSON.stringify(message), err => {
      if (err) {
        console.error(err);
      } else {
        console.log("Sent message");
      }
      cb(err)
    });
  }
}

export {DeviceTransmitter};
