import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class Empty extends testbed.Test {
  constructor() {
    super();
  }

  static Create() {
    return new Empty();
  }
}
