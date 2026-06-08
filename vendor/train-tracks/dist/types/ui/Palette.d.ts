import type { WorldEnd } from "../track/types";
type Props = {
    activeEnd: WorldEnd | null;
    onPaletteClick: (type: string) => void;
    freehandActive: boolean;
};
export declare const FREEHAND_TOOL = "freehand-draw";
export default function Palette(props: Props): import("solid-js").JSX.Element;
export {};
