import { type TrackInput } from "./resolve";
export type TrackFigureProps = TrackInput & {
    padding?: number;
    showAdapters?: boolean;
    class?: string;
};
export default function TrackFigure(props: TrackFigureProps): import("solid-js").JSX.Element;
