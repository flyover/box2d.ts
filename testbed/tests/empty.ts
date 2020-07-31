import * as box2d from "@box2d";
import * as testbed from "../testbed.js";

export class Empty extends testbed.Test {
  constructor() {
    super();
    console.log(box2d.b2_version);
  }

  public static Create() {
    return new Empty();
  }
}
