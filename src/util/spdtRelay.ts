import toggleRelay from "../toggleRelay";
import { Device, DeviceConfig } from "./device";
import { TransmitterConfig } from "./transmitter";

class SpdtRelay extends Device {
  constructor(deviceConfig: DeviceConfig, transmitterConfig: TransmitterConfig) {
    super(deviceConfig, transmitterConfig);

    this.client.on("connect", () => {
      console.log("spdtRelay connected");

    })
  }


  onMessage(topic: string, payload: Buffer): void {
    console.log("spdtRelay recieved message");
    let message;
    try {
      message = JSON.parse(payload.toString());
      console.log("Payload successfully converted to JSON");

    } catch (error) {
      console.error("Payload not JSON, converting to string");
      message = payload.toString();
      console.log("Payload converted to string");
    }
    console.log(`${topic}: ${message}`);

    if (typeof message === "object") {
      const setValue = message.setValue;
      if (setValue === 1 || 0) {
        console.log("Setting relay to: ", setValue);
        toggleRelay(setValue, this.deviceConfig.ioPort, (result) => {
          const message = { setTo: result };
          this.send(topic, message, (err) => {
            if (err) {
              console.error(`Error sending message ${message} on topic ${topic} to thingsboard: ${err}`);
            } else {
              console.log(`Successfully sent ${message} on ${topic} to thingsboard!`);
            }
          });

        });
      }
    }

  }
}

export { SpdtRelay };



// const t = (host: string, accessToken: string, ioPort: number): void => {
//   console.log(`Starting Relay on port ${ioPort}`);

//   const client = mqtt.connect(`mqtt://${host}`, { username: accessToken, protocol: "mqtt" })

//   // Connection callback
//   client.on('connect', () => {
//     console.log(`mqtt client connected`);
//     client.subscribe("v1/devices/me/rpc/request/+")
//   });

//   client.on('reconnect', () => {
//     console.log("reconnected");
//   })



//   // When a message arrives, console.log it
//   client.on('message', function (topic, message) {
//     console.log('request.topic: ' + topic);
//     const body = JSON.parse(message.toString());
//     console.log('request.body: ' + message.toString());
//     const requestId = topic.slice('v1/devices/me/rpc/request/'.length);

//     if (body["method"] === "setValue") {
//       const state = body["params"] === false ? 0 : 1;

//       client.publish('v1/devices/me/rpc/response/' + requestId, JSON.stringify({ "method": "setValue", "params": body["params"] }));
//     }
//     if (body["method"] === "getValue") {
//       client.publish('v1/devices/me/rpc/response/' + requestId, message);
//     }
//     //client acts as an echo service
//     // client.publish('v1/devices/me/rpc/response/' + requestId, message);
//   });

//   client.on('close', () => {
//     client.reconnect()
//   });

//   // Mqtt error calback
//   client.on('error', (err) => {
//     console.log("ERROR: ", err);
//   });
// }