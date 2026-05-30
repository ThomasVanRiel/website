import type { ArmGeom, LocalEnd, PieceDef, Polarity, Vec2 } from "./types";
export declare const magicConnector: PieceDef;
export declare function makeMagicGeometry(endA: {
    position: Vec2;
    angle: number;
    polarity: Polarity;
}, endB: {
    position: Vec2;
    angle: number;
    polarity: Polarity;
}): {
    ends: LocalEnd[];
    arms: ArmGeom[];
    bounds: {
        min: Vec2;
        max: Vec2;
    };
};
