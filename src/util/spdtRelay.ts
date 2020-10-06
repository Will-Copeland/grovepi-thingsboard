// import mqtt from "mqtt";
// import toggleRelay from "../toggleRelay";
// import { DeviceTransmitter } from "./transmitter";


// export default {
//   read: function read(ioPort: number, cb: () => void): void {
//     //coming sooon?
//   },
//   set: function set(ioPort: number, state: "on" | "off", cb: (relaySetTo: string) => void): void {
//     toggleRelay(state === "on" ? 1 : 0, ioPort, cb);
//   }
// }


// class SpdtRelay extends DeviceTransmitter {
// constructor(deviceConfig: unknown) {
//   super(deviceConfig);
// }


// onMessage() {

// }


// read() {

// }

// }




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


