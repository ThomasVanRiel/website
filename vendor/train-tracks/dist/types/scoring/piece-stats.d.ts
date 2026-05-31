import type { Track } from "../track/types";
import type { ScoreMap } from "./types";
export type PieceStat = {
    total: number;
    atob: number;
    btoa: number;
};
export declare function aggregatePieceStats(track: Track, scores: ScoreMap): Map<string, PieceStat>;
export declare function trackEntropy(scores: ScoreMap): number;
export declare function trackGini(scores: ScoreMap): number;
export declare function totalTrackLength(track: Track): number;
export type SwitchBias = {
    arm0: number;
    arm1: number;
};
export declare function switchBiases(track: Track, scores: ScoreMap): Map<string, SwitchBias>;
