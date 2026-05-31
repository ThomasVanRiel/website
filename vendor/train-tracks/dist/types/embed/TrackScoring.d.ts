import { type SeedSpec, type TrackInput } from "./resolve";
export type TrackScoringProps = TrackInput & {
    mode?: "closed-form" | "mc";
    seed?: SeedSpec;
    bulgeScale?: number;
    padding?: number;
    advancedStats?: boolean;
    class?: string;
};
export default function TrackScoring(props: TrackScoringProps): import("solid-js").JSX.Element;
