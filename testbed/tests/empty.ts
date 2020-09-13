import * as b2 from "@box2d";
import * as testbed from "../testbed.js";

export class Empty extends testbed.Test {
  constructor() {
    super();
    console.log(b2.version);
  }

  public static Create() {
    return new Empty();
  }
}
