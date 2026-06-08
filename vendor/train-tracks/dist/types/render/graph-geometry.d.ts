import type { Vec2 } from "../pieces/types";
import type { TrackGraph } from "../graph/topology";
export declare const STEM_LEN = 70;
export declare function simplifyParams(simplify: number): {
    resampleStep: number;
    lambda: number;
    mu: number;
};
export declare function pointSeg(p: Vec2, a: Vec2, b: Vec2): {
    d: number;
    c: Vec2;
};
export declare function resample(poly: Vec2[], n: number, closed: boolean): Vec2[];
export declare function splinePath(p: Vec2[], closed: boolean): string;
export declare function forkSplinePath(p: Vec2[], startDir: Vec2 | null, endDir: Vec2 | null): string;
export declare function splinePolyline(p: Vec2[], closed: boolean, perSeg?: number): Vec2[];
export declare function computeRelaxed(graph: TrackGraph, simplify: number): Vec2[][];
export type ForkEnd = {
    pt: Vec2;
    dir: Vec2;
};
export type ForkResult = {
    forkEnd: Map<string, ForkEnd>;
    stems: Vec2[][];
};
export declare function computeForks(graph: TrackGraph, relaxed: Vec2[][], stemScale?: number): ForkResult;
export declare function edgePathFrom(closed: boolean, pts: Vec2[], forkA?: ForkEnd, forkB?: ForkEnd): string;
