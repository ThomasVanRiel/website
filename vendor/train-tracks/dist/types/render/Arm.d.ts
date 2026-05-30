import type { ArmGeom } from "../pieces/types";
import type { Transform } from "../lib/transform";
type Props = {
    arm: ArmGeom;
    transform: Transform;
    pAtoBFrom?: number;
    pAtoBTo?: number;
    pBtoAFrom?: number;
    pBtoATo?: number;
    bulgeScale?: number;
    dashed?: boolean;
    bulgeOnly?: boolean;
    class?: string;
};
export default function Arm(props: Props): import("solid-js").JSX.Element;
export {};
