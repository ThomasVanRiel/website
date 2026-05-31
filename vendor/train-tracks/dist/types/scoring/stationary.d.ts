import type { Track } from "../track/types";
import { type EnumeratedStates, type TransitionMatrix } from "./states";
import { type DeadEndPolicy, type ScoreMap } from "./types";
export type StationaryResult = {
    scores: ScoreMap;
    spectralGap: number;
};
export declare function stationary(track: Track, options?: {
    deadEndPolicy?: DeadEndPolicy;
    iterations?: number;
}): StationaryResult;
export type { EnumeratedStates, TransitionMatrix };
