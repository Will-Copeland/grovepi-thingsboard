import { Device, DeviceConfig } from "./device";
import { TransmitterConfig } from "./transmitter";
import { spawnSync } from "child_process";

class SpdtRelay extends Device {
  constructor(deviceConfig: DeviceConfig, transmitterConfig: TransmitterConfig) {
    super(deviceConfig, transmitterConfig);


    this.client.on("connect", () => {
      console.log("spdtRelay connected");
    });

    this.client.on("message", (topic: string, payload: Buffer) => this.onMessage(topic, payload));
  }


  getValue(topic: string): void {
    const process = spawnSync("python", [`/home/pi/grovepi-thingsboard/dist/Python/readRelay.py`, `${this.deviceConfig.ioPort}`]);
    console.log("readRelay result: ", process.stdout);
    const msg = { params: true };
    console.log("msg: ", msg);

    this.send(topic, msg, (err: any) => {
      if (err) {
        console.error("Error sending read Value: ", err);

      } else {
        console.log("sent message from getValue: ",);

      }
    })
  }


  setValue(value: number, topic?: string): void {
    const process = spawnSync("python", [`/home/pi/grovepi-thingsboard/dist/Python/${value === 0 ? "relayOff" : "relayOn"}.py`, `${this.deviceConfig.ioPort}`]);

    console.log("Relay set: ", process.stdout);

    const replyMessage = { "setTo": `${process.stdout}` };

    if (topic) {
      console.log("sending return msg...");

      this.send(topic, replyMessage, (err) => {
        if (err) {
          console.error(`Error sending message ${replyMessage} on topic ${topic} to thingsboard: ${err}`);
        } else {
          console.log(`Successfully sent ${replyMessage} on ${topic} to thingsboard!`);
        }
      });
    }
  }


  onMessage(topic: string, payload: Buffer): void {
    console.log("spdtRelay recieved message");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let message: any;
    try {
      message = JSON.parse(payload.toString());
      console.log("Payload successfully converted to JSON");

    } catch (error) {
      console.error("Payload not JSON, converting to string");
      message = payload.toString();
      console.log("Payload converted to string");
    }
    console.log(`Topic: ${topic}`);
    console.log("Message: ", message);

    if (typeof message === "object") {
      const action = message.method;
      const value = message.params;

      if (action === "setValue") {
        this.setValue(value === true ? 1 : 0);
      } else if (action === "getValue") {
        this.getValue(topic);
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