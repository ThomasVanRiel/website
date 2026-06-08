import { type TrackInput } from "./resolve";
import { type Lang } from "./i18n";
export type TrackToGraphProps = TrackInput & {
    padding?: number;
    showLabels?: boolean;
    autoplay?: boolean;
    lang?: Lang;
    class?: string;
};
export default function TrackToGraph(props: TrackToGraphProps): import("solid-js").JSX.Element;
