import type { Track } from "../track/types";
import type { ScoreMap } from "./types";
export type PieceStat = {
    total: number;
    atob: number;
    btoa: number;
};
export declare function aggregatePieceStats(track: Track, scores: ScoreMap): Map<string, PieceStat>;
export declare function trackEntropy(scores: ScoreMap): number;
