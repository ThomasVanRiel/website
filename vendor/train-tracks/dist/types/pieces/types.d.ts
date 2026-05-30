export type Vec2 = readonly [number, number];
export type Polarity = "M" | "F";
export type LocalEnd = {
    position: Vec2;
    angle: number;
    polarity: Polarity;
};
export type ArmGeom = {
    kind: "line";
    from: Vec2;
    to: Vec2;
} | {
    kind: "arc";
    from: Vec2;
    to: Vec2;
    center: Vec2;
    radius: number;
    ccw: boolean;
} | {
    kind: "bezier";
    from: Vec2;
    to: Vec2;
    c1: Vec2;
    c2: Vec2;
} | {
    kind: "composite";
    parts: ArmGeom[];
};
export type PieceCategory = "straight" | "curve" | "junction" | "crossing" | "adapter" | "magic";
export declare const PIECE_CATEGORIES: readonly PieceCategory[];
export type PieceDef = {
    type: string;
    category: PieceCategory;
    ends: LocalEnd[];
    connections: readonly (readonly [number, number])[];
    arms: ArmGeom[];
    bounds: {
        min: Vec2;
        max: Vec2;
    };
};
