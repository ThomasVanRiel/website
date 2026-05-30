import type { Track } from "../track/types";
import type { ChainState, Direction } from "../scoring/types";
export type SeedSpec = {
    pieceIndex: number;
    connectionIndex?: number;
    direction?: Direction;
};
export type TrackInput = {
    preset: string;
    track?: undefined;
} | {
    track: Track | unknown;
    preset?: undefined;
};
export type ResolvedFigure = {
    track: Track;
    seed: ChainState | null;
};
export declare function resolveFigure(input: TrackInput): ResolvedFigure;
export declare function resolveSeed(figure: ResolvedFigure, spec?: SeedSpec): ChainState | null;
