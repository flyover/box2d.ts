import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class Empty extends testbed.Test {
  constructor() {
    super();
    console.log(box2d.b2_version);
  }

  public static Create() {
    return new Empty();
  }
}
