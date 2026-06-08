import type { Track } from "../track/types";
import { type BBox } from "./bounds";
type Props = {
    track: Track;
    bbox?: BBox;
    simplify?: number;
    svgRef?: (el: SVGSVGElement) => void;
    class?: string;
};
export default function GraphView(props: Props): import("solid-js").JSX.Element;
export {};
