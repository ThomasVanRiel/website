import type { Polarity } from "../pieces/types";
export declare function pickAttachingEndIndex(type: string, activePolarity: Polarity): number | null;
export declare function defaultContinueEndIndex(type: string, attachingEndIndex: number): number;
