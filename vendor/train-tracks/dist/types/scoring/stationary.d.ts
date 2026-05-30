import type { Track } from "../track/types";
import { type EnumeratedStates, type TransitionMatrix } from "./states";
import { type DeadEndPolicy, type ScoreMap } from "./types";
export declare function stationary(track: Track, options?: {
    deadEndPolicy?: DeadEndPolicy;
    iterations?: number;
}): ScoreMap;
export type { EnumeratedStates, TransitionMatrix };
