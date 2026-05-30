import type { ArmGeom, LocalEnd, Vec2 } from "../pieces/types";
export type Transform = {
    position: Vec2;
    rotation: number;
};
export declare const identityTransform: Transform;
export declare function transformPoint([x, y]: Vec2, t: Transform): Vec2;
export declare function transformAngle(angle: number, t: Transform): number;
export declare function transformEnd(end: LocalEnd, t: Transform): LocalEnd;
export declare function transformArm(arm: ArmGeom, t: Transform): ArmGeom;
export declare function normalizeAngle(a: number): number;
