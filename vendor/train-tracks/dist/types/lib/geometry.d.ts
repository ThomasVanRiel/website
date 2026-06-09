import type { ArmGeom, Vec2 } from "../pieces/types";
export declare function distance(a: Vec2, b: Vec2): number;
export declare function armLength(arm: ArmGeom): number;
export declare function armBounds(arm: ArmGeom): {
    min: Vec2;
    max: Vec2;
};
export type ArmSample = {
    point: Vec2;
    tangent: Vec2;
    normal: Vec2;
};
export declare function sampleArm(arm: ArmGeom, t: number): ArmSample;
export declare function sampleArmEvenly(arm: ArmGeom, n: number): ArmSample[];
