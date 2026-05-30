export type Direction = "AtoB" | "BtoA";
export type ChainState = {
    pieceId: string;
    connectionIndex: number;
    direction: Direction;
};
export type DeadEndPolicy = "reflect" | "absorb";
export type ScoreMap = Map<string, number>;
export declare function stateKey(s: ChainState): string;
