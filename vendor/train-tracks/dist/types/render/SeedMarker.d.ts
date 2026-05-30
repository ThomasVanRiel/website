import type { ChainState } from "../scoring/types";
import type { Track } from "../track/types";
type Props = {
    state: ChainState;
    track: Track;
};
export default function SeedMarker(props: Props): import("solid-js").JSX.Element;
export {};
