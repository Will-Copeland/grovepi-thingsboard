// import MqttHandler from "./util/mqttHandler";
// import apiKey from "./util/apiKey";
import { TransmitterConfig } from "./util/transmitter";
import fs from "fs";
import DHT22 from "./util/dht22";
import { DeviceConfig } from "./util/device";
import { SpdtRelay } from "./util/spdtRelay";

// eslint-disable-next-line @typescript-eslint/no-var-requires


export interface AppConfig {
  transmitterConfig: TransmitterConfig;
  devices: DeviceConfig[];
}

function getConfig(): AppConfig  {
  try {
    // const config1 = require("./config.json");

    const config2 = JSON.parse(fs.readFileSync("./config.json").toString());

    return config2;
  } catch (error) {
    console.error("ERROR reading config file: ", error);
    process.exit();
  }
}

function main(): void {
  let activeDevices = {

  };

  const config = getConfig();

  const deviceMap = {
    "dht22": DHT22,
    "spdtRelay": SpdtRelay,
  }

  const transmitterConfig = config.transmitterConfig
  config.devices.map((deviceConfig) => {
    console.log(`Instantiating ${deviceConfig.type} on port ${deviceConfig.ioPort}...`);

    const device = new deviceMap[deviceConfig["type"]](deviceConfig, transmitterConfig);

    console.log("Device instantiated");
    activeDevices = {...activeDevices, [deviceConfig.type]: device};
  });


  console.log("All devices instantiated...");

}

main();