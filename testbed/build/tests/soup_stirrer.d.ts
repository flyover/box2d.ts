import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
import { Soup } from "./soup.js";
export declare class SoupStirrer extends Soup {
    m_stirrer: box2d.b2Body;
    m_joint: box2d.b2Joint | null;
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
    MouseUp(p: box2d.b2Vec2): void;
    /**
     * Determine whether a point is in the soup.
     */
    InSoup(pos: box2d.b2Vec2): boolean;
    /**
     * Apply a force to the stirrer.
     */
    Step(settings: testbed.Settings): void;
    static Create(): SoupStirrer;
}
//# sourceMappingURL=soup_stirrer.d.ts.map