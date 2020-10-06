import { DeviceTransmitter } from "./transmitter";

export interface DeviceConfig {
  id: string;
  accessToken: string;
  type: "dht22";
}

class Device extends DeviceTransmitter {
  constructor(deviceConfig: DeviceConfig) {
    super(deviceConfig);

    this.deviceConfig = deviceConfig;
  }
  public deviceConfig: DeviceConfig

}


export { Device };