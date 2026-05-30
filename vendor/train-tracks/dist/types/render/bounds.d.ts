import type { Track } from "../track/types";
export type BBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function trackBounds(track: Track, padding?: number): BBox;
