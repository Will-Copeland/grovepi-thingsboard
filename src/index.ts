// import MqttHandler from "./util/mqttHandler";
// import apiKey from "./util/apiKey";
import { TransmitterConfig } from "./util/transmitter";
import fs from "fs";
import DHT22 from "./util/dht22";
import { DeviceConfig } from "./util/device";

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
  }

  config.devices.map((deviceConfig) => {
    const device = new deviceMap[deviceConfig["type"]](deviceConfig);
    activeDevices = {...activeDevices, [deviceConfig.type]: device};
  });

}

main();