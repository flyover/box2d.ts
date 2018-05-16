import * as testbed from "../Testbed";
export declare class Soccer extends testbed.Test {
    private wallFixDef;
    private ballFixDef;
    private goalFixDef;
    private heightShift;
    constructor();
    private scale(x, y);
    static Create(): testbed.Test;
}
