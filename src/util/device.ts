import { DeviceTransmitter, TransmitterConfig } from "./transmitter";

export interface DeviceConfig {
  id: string;
  accessToken: string;
  type: "dht22";
  ioPort: number;
}

class Device extends DeviceTransmitter {
  constructor(deviceConfig: DeviceConfig, transmitterConfig: TransmitterConfig) {
    super(transmitterConfig, deviceConfig);
    this.deviceConfig = deviceConfig;
  }
  public deviceConfig: DeviceConfig

}


export { Device };