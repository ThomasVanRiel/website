import { type SeedSpec, type TrackInput } from "./resolve";
import { type Lang } from "./i18n";
export type TrackScoringProps = TrackInput & {
    mode?: "closed-form" | "mc";
    seed?: SeedSpec;
    bulgeScale?: number;
    padding?: number;
    advancedStats?: boolean;
    lang?: Lang;
    class?: string;
};
export default function TrackScoring(props: TrackScoringProps): import("solid-js").JSX.Element;
