import { type TrackFigureProps } from "./TrackFigure";
import { type TrackScoringProps } from "./TrackScoring";
import { type TrackLiveMCProps } from "./TrackLiveMC";
import { type TrackToGraphProps } from "./TrackToGraph";
export declare function mountTrackFigure(el: HTMLElement, props: TrackFigureProps): () => void;
export declare function mountTrackScoring(el: HTMLElement, props: TrackScoringProps): () => void;
export declare function mountTrackLiveMC(el: HTMLElement, props: TrackLiveMCProps): () => void;
export declare function mountTrackToGraph(el: HTMLElement, props: TrackToGraphProps): () => void;
