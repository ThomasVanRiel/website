import { type Junction } from "../track/junctions";
import type { Track } from "../track/types";
import type { ChainState, DeadEndPolicy } from "./types";
export type EnumeratedStates = {
    states: ChainState[];
    index: Map<string, number>;
    junctions: Junction[];
};
export declare function enumerateStates(track: Track): EnumeratedStates;
export type SparseRow = {
    col: number;
    p: number;
}[];
export type TransitionMatrix = SparseRow[];
export declare function buildTransitionMatrix(track: Track, enumerated: EnumeratedStates, deadEndPolicy?: DeadEndPolicy): TransitionMatrix;
