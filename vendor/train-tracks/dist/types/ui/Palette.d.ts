import type { WorldEnd } from "../track/types";
type Props = {
    activeEnd: WorldEnd | null;
    onPaletteClick: (type: string) => void;
};
export default function Palette(props: Props): import("solid-js").JSX.Element;
export {};
