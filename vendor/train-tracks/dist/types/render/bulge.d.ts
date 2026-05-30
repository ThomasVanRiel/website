import type { ArmGeom } from "../pieces/types";
import { type Transform } from "../lib/transform";
export declare function buildBulgeHalf(arm: ArmGeom, transform: Transform, pFrom: number, pTo: number, scale: number, side: "atob" | "btoa", samples?: number): string;
