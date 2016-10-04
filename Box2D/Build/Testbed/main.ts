/// <reference path="../../../Box2D/Testbed/Framework/Main.ts"/>

declare function requestAnimFrame(callback: any): number;

namespace main {

let m_app = null;

export function start() {
  m_app = new box2d.Testbed.Main();
  loop();
}

function loop() {
  requestAnimFrame(loop);
  m_app.SimulationLoop();
}

} // namespace main
