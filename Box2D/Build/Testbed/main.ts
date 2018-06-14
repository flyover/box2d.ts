import * as testbed from "Testbed";

let app: testbed.Main;
const init = (time: number) => {
  app = new testbed.Main(time);
  window.requestAnimationFrame(loop);
};
const loop = (time: number) => {
  window.requestAnimationFrame(loop);
  app.SimulationLoop(time);
};
window.requestAnimationFrame(init);
