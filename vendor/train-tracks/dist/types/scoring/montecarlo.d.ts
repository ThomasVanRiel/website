import type { Track } from "../track/types";
import { type ChainState, type DeadEndPolicy, type Direction, type ScoreMap } from "./types";
export declare function montecarlo(track: Track, options?: {
    steps?: number;
    deadEndPolicy?: DeadEndPolicy;
    seed?: number;
    startState?: ChainState;
    startDirection?: Direction;
}): ScoreMap;
