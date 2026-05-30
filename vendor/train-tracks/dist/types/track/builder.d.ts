import type { Track, WorldEnd } from "./types";
export type BuildState = {
    track: Track;
    active: WorldEnd | null;
};
export declare function emptyTrack(): Track;
export declare function placeInitial(type: string, position?: [number, number], rotation?: number, activeEndIndex?: number): BuildState;
export declare function attachNext(state: BuildState, type: string, options?: {
    attachingEndIndex?: number;
    continueEndIndex?: number;
}): BuildState;
