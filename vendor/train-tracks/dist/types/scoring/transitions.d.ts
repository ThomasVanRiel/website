import type { SparseRow } from "./states";
export declare function makeRng(seed: number): () => number;
export declare function sampleNextIndex(row: SparseRow, rng: () => number): number;
