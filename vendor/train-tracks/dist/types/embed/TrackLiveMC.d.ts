import { type SeedSpec, type TrackInput } from "./resolve";
import { type Lang } from "./i18n";
export type TrackLiveMCProps = TrackInput & {
    initialSpeed?: number;
    seed?: SeedSpec;
    bulgeScale?: number;
    padding?: number;
    showAdapters?: boolean;
    advancedStats?: boolean;
    hideStats?: boolean;
    hideControls?: boolean;
    lang?: Lang;
    class?: string;
};
export default function TrackLiveMC(props: TrackLiveMCProps): import("solid-js").JSX.Element;
