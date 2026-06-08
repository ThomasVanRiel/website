import type { Vec2 } from "../pieces/types";
import type { Track } from "../track/types";
export type GraphNodeKind = "free" | "switch" | "loop";
export type GraphNode = {
    id: number;
    position: Vec2;
    kind: GraphNodeKind;
    degree: number;
};
export type GraphEdge = {
    a: number;
    b: number;
    aPiece: string;
    bPiece: string;
    pieceIds: string[];
    length: number;
    polyline: Vec2[];
};
export type TrackGraph = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};
export declare function deriveGraph(track: Track): TrackGraph;
