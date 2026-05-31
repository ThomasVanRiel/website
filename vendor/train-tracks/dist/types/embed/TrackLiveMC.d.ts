import { type SeedSpec, type TrackInput } from "./resolve";
export type TrackLiveMCProps = TrackInput & {
    initialSpeed?: number;
    seed?: SeedSpec;
    bulgeScale?: number;
    padding?: number;
    showAdapters?: boolean;
    advancedStats?: boolean;
    class?: string;
};
export default function TrackLiveMC(props: TrackLiveMCProps): import("solid-js").JSX.Element;
