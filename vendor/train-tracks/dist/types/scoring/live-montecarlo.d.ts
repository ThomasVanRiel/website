import { type Accessor } from "solid-js";
import type { Track } from "../track/types";
import type { ArmGeom, Vec2 } from "../pieces/types";
import { type ChainState, type DeadEndPolicy, type Direction, type ScoreMap } from "./types";
export type SpeedMode = {
    kind: "paused";
} | {
    kind: "running";
    unitsPerSecond: number;
} | {
    kind: "snap";
};
export declare function decodeSpeed(v: number, allowSnap?: boolean): SpeedMode;
export type Walker = {
    position: Vec2;
    tangent: Vec2;
    pieceId: string;
    /** Current chain state — needed to traverse backwards across arms. */
    state: ChainState;
    /** World-space arm the locomotive is currently on. */
    arm: ArmGeom;
    /** t value passed to sampleArm (0 = arm.from, 1 = arm.to), adjusted for direction. */
    sampleT: number;
    armLen: number;
    direction: Direction;
    /**
     * Recently-traversed states, most-recent-first (the state immediately before
     * the current one is at index 0). Lets the train sprite trail its wagons
     * along the path actually walked instead of guessing a predecessor.
     */
    trail: ChainState[];
};
export declare function createLiveMC(args: {
    track: Accessor<Track>;
    speed: Accessor<SpeedMode>;
    enabled: Accessor<boolean>;
    seed?: Accessor<ChainState | null>;
    deadEndPolicy?: DeadEndPolicy;
}): {
    scores: Accessor<ScoreMap>;
    recentScores: Accessor<ScoreMap>;
    walker: Accessor<Walker | null>;
    reset: () => void;
    currentDirection: () => Direction | null;
    totalDistance: Accessor<number>;
};
