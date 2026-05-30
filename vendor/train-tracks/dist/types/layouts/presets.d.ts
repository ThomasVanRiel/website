import type { Track } from "../track/types";
import { type SerializedSeed } from "../export/json";
export type Preset = {
    id: string;
    label: string;
    description: string;
    closed: boolean;
    seed?: SerializedSeed;
    build: () => Track;
};
export declare const PRESETS: Preset[];
export declare function findPreset(id: string): Preset | null;
