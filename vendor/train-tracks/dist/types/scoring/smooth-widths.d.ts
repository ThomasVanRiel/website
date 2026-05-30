import type { Track } from "../track/types";
import type { ScoreMap } from "./types";
import type { PieceDef } from "../pieces/types";
export type SmoothedArm = {
    atobFrom: number;
    atobTo: number;
    btoaFrom: number;
    btoaTo: number;
};
export type SmoothedWidths = Map<string, SmoothedArm>;
export declare function maxBulgeWidth(sw: SmoothedWidths): number;
export declare function intoLabelIsAtoB(def: PieceDef, ci: number, endIndex: number): boolean;
export declare function computeSmoothedWidths(track: Track, scores: ScoreMap): SmoothedWidths;
