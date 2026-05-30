import type { ArmGeom, LocalEnd, Polarity, Vec2 } from "../pieces/types";
export type PlacedPiece = {
    id: string;
    type: string;
    position: Vec2;
    rotation: number;
    magic?: {
        ends: LocalEnd[];
        arms: ArmGeom[];
        bounds: {
            min: Vec2;
            max: Vec2;
        };
    };
};
export type Track = {
    pieces: PlacedPiece[];
};
export type PieceEndRef = {
    pieceId: string;
    endIndex: number;
};
export type WorldEnd = {
    position: Vec2;
    angle: number;
    polarity: Polarity;
    ref: PieceEndRef;
};
