import type { LocalEnd } from "../pieces/types";
import { type Transform } from "../lib/transform";
import type { PlacedPiece, WorldEnd } from "./types";
export declare function newPieceId(): string;
export declare function bumpPieceCounter(atLeast: number): void;
export declare function transformOf(piece: PlacedPiece): Transform;
export declare function pieceWorldEnds(piece: PlacedPiece): LocalEnd[];
export declare function attach(type: string, attachingEndIndex: number, target: WorldEnd): PlacedPiece | null;
export declare function polarityMates(a: "M" | "F", b: "M" | "F"): boolean;
