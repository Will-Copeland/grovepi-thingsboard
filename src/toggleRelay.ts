import { spawn } from "child_process";

export default (state: 0 | 1, port: number, cb: (relaySetTo: string) => void): void => {
  console.log(`../Python/${state === 0 ? "relayOff" : "relayOn"}.py ${port}`);

  const process = spawn("python", [`../Python/${state === 0 ? "relayOff" : "relayOn"}.py ${port}`]);
  process.stdout.on("data", data => {
    const output = data.toString();
    console.log("relay set to: ", output);
    cb(output);
  });
  process.stderr.on("data", d => {
    console.log(d.toString());
  })
}
