import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
import { Soup } from "./soup.js";
export declare class SoupStirrer extends Soup {
    m_stirrer: b2.Body;
    m_joint: b2.Joint | null;
    m_oscillationOffset: number;
    constructor();
    CreateJoint(): void;
    /**
     * Enable the joint if it's disabled, disable it if it's
     * enabled.
     */
    ToggleJoint(): void;
    /**
     * Press "t" to enable / disable the joint restricting the
     * stirrer's movement.
     */
    Keyboard(key: string): void;
    /**
     * Click the soup to toggle between enabling / disabling the
     * joint.
     */
    MouseUp(p: b2.Vec2): void;
    /**
     * Determine whether a point is in the soup.
     */
    InSoup(pos: b2.Vec2): boolean;
    /**
     * Apply a force to the stirrer.
     */
    Step(settings: testbed.Settings): void;
    static Create(): SoupStirrer;
}
