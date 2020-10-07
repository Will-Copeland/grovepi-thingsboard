import { spawn } from "child_process";

export default (state: 0 | 1, port: number, cb: (relaySetTo: string) => void): void => {
  console.log(`/home/pi/grovepi-thingsboard/dist/Python/${state === 0 ? "relayOff" : "relayOn"}.py ${port}`);

  const process = spawn("python", [`/home/pi/grovepi-thingsboard/dist/Python/${state === 0 ? "relayOff" : "relayOn"}.py ${port}`]);
  process.stdout.on("data", data => {
    const output = data.toString();
    console.log("relay set to: ", output);
    cb(output);
  });
  process.stderr.on("data", d => {
    console.log(d.toString());
  })
}
