import type { Track } from "../track/types";
import type { SmoothedWidths } from "../scoring/smooth-widths";
type Props = {
    track: Track;
    smoothedWidths: SmoothedWidths;
    bulgeScale: number;
};
export default function JunctionFan(props: Props): import("solid-js").JSX.Element;
export {};
