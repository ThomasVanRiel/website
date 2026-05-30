import type { JSX } from "solid-js";
import type { Walker } from "../scoring/live-montecarlo";
import type { Track } from "../track/types";
type Props = {
    walker: Walker;
    track: Track;
};
export default function Train(props: Props): JSX.Element;
export {};
