import type { Vec2 } from "../pieces/types";
import type { PieceEndRef, Track } from "./types";
export type Junction = {
    id: number;
    members: PieceEndRef[];
    position: Vec2;
};
export declare function clusterEnds(track: Track, epsilon?: number): Junction[];
export type FreeEnd = {
    ref: PieceEndRef;
    position: Vec2;
};
export declare function freeEnds(track: Track): FreeEnd[];
export declare function junctionOf(junctions: Junction[], ref: PieceEndRef): Junction | null;
