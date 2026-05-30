import type { Track } from "../track/types";
import type { ChainState, Direction } from "../scoring/types";
export type SerializedSeed = {
    pieceIndex: number;
    connectionIndex: number;
    direction: Direction;
};
export type DeserializedTrack = {
    track: Track;
    seed: ChainState | null;
};
declare function deserializeTrack(data: unknown): DeserializedTrack;
export declare function resolveSeedSpec(track: Track, spec: SerializedSeed | null | undefined): ChainState | null;
export declare function serialize(track: Track, seed?: ChainState | null): string;
export declare function deserialize(json: string): DeserializedTrack;
export { deserializeTrack };
export declare function downloadTrackJson(track: Track, filename?: string, seed?: ChainState | null): void;
export declare function uploadTrackJson(onLoaded: (track: Track, seed: ChainState | null) => void): void;
