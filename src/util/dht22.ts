import { spawnSync } from "child_process";
import { TransmitterConfig } from "./transmitter";
import { Packet } from "mqtt";
import { DeviceConfig, Device } from "./device";
import fs from "fs";
import path from "path";

export interface DHT22Interface {
  onMessage: (topic: string, payload: Buffer, packet: Packet) => void;
  read: () => void;
  send: () => void;
}

class DHT22 extends Device {
  constructor(deviceConfig: DeviceConfig, transmitterConfig: TransmitterConfig) {
    super(deviceConfig, transmitterConfig);

    this.client.on("message", this.onMessage);

    this.client.on("connect", () => {
      this.read();
    })
  }
  public interval!: NodeJS.Immediate;

  onMessage(topic: string, payload: Buffer): void {
    console.log("Incoming message for ", topic, "payload: ", payload);

    this.read();
  }


  testMessage(): void {
    super.send("v1/devices/me/telemetry", { temp:"33", humidity: "14" }, err => {
      if (err) {
        console.log(`Error sending ${this.deviceConfig.id}`);
      } else {
        console.log("Successfully sent temp and hum update");
      }
    });
  }

  read(): void {
    console.log("Attempting to read data...");
    const dir = __dirname;
    console.log("Dir: ", dir);

    fs.readdir(dir, (er, files) => {
      console.log(files);

    })
    const process = spawnSync("python", ["/home/pi/grovepi-thingsboard/dist/util/readTemp.py"]);
    console.log("STDOUT: ", process.stdout.toString());

      const str = process.stdout.toString();
      console.log("err: ", str);

      const arr = str.split(" ");
      console.log("n", str);

      const [temp, humidity] = arr.map((d: string) => {
        const Str = d.replace("\n", "");
        return (Str as unknown as number) * 1;
      });

      console.log("Temp, hum?: ", temp, humidity);

      this.send("v1/devices/me/telemetry", { temp, humidity }, err => {
        if (err) {
          console.log(`Error sending ${this.deviceConfig.id}`);
        } else {
          console.log("Successfully sent temp and hum update");
        }
      })
  }
}

export default DHT22;