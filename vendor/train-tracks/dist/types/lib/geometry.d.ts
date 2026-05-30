import type { ArmGeom, Vec2 } from "../pieces/types";
export declare function distance(a: Vec2, b: Vec2): number;
export declare function armLength(arm: ArmGeom): number;
export type ArmSample = {
    point: Vec2;
    tangent: Vec2;
    normal: Vec2;
};
export declare function sampleArm(arm: ArmGeom, t: number): ArmSample;
export declare function sampleArmEvenly(arm: ArmGeom, n: number): ArmSample[];
