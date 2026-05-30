import type { PieceDef } from "./types";
export declare const PIECES: Record<string, PieceDef>;
export declare const PIECE_TYPES: readonly string[];
export declare function getPiece(type: string): PieceDef;
