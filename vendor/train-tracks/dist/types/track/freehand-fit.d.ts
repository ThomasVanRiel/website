import type { Vec2 } from "../pieces/types";
import type { PlacedPiece, WorldEnd } from "./types";
type StrokeSample = {
    pos: Vec2;
    arc: number;
    tangent: number;
};
export declare function prepareStroke(raw: Vec2[], spacing?: number): StrokeSample[];
export type FreehandSeed = {
    kind: "end";
    end: WorldEnd;
} | {
    kind: "open";
    position: Vec2;
    tangent: number;
};
export type FreehandEnd = {
    kind: "end";
    end: WorldEnd;
} | {
    kind: "open";
};
export type FreehandResult = {
    pieces: PlacedPiece[];
    openFrontier: WorldEnd | null;
};
export declare function fitFreehand(opts: {
    stroke: Vec2[];
    start: FreehandSeed;
    end: FreehandEnd;
}): FreehandResult;
export {};
