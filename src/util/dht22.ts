import { spawn } from "child_process";
import { TransmitterConfig } from "./transmitter";
import { Packet } from "mqtt";
import { DeviceConfig, Device } from "./device";


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

    const process = spawn("python", ["./readTemp.py"]);
    console.log("child process started: ", process);

    process.on("exit", (code) => {
      console.log("Process disconnected", code);
    })

    process.on("close", (code) => {
      console.log("Process closed: ", code);
    });

    process.on("message", () => {
      console.log("mesaage from process");

    })
    process.stdout.on("data", (data: Buffer) => {
      console.log("data got");

      const str = data.toString();
      const arr = str.split(" ");
      console.log("n", str);

      const [temp, humidity] = arr.map((d: string) => {
        const Str = d.replace("\n", "");
        return (Str as unknown as number) * 1;
      });

      process.stderr.on("data", (er) => {
        console.log("ERROROROROROR: ", er);

      })
      console.log("attempting to send...", temp, humidity);

      this.send("v1/devices/me/telemetry", { temp, humidity }, err => {
        if (err) {
          console.log(`Error sending ${this.deviceConfig.id}`);
        } else {
          console.log("Successfully sent temp and hum update");
        }
      })
    });
  }
}

export default DHT22;