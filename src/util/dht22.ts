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

    this.interval = setInterval(this.read, 2000);
  }
  public interval: NodeJS.Timeout;

  onMessage(topic: string, payload: Buffer): void {
    console.log("Incoming message for ", topic, "payload: ", payload);

    this.read();
  }

  read(): void {
    console.log("Attempting to read data...");

    const process = spawn("python", ["./Python/readTemp.py"]);
    console.log("child process started");

    process.stdout.on("data", (data: Buffer) => {
      console.log("data got");

      const str = data.toString();
      const arr = str.split(" ");
      console.log("n", str);

      const [temp, humidity] = arr.map((d: string) => {
        const Str = d.replace("\n", "");
        return (Str as unknown as number) * 1;
      });


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