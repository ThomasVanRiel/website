import type { PlacedPiece } from "../track/types";
import type { ScoreMap } from "../scoring/types";
import type { SmoothedWidths } from "../scoring/smooth-widths";
type Props = {
    piece: PlacedPiece;
    scores?: ScoreMap;
    smoothedWidths?: SmoothedWidths;
    bulgeScale?: number;
    showPolarity?: boolean;
    showAdapters?: boolean;
    selected?: boolean;
    onSelect?: () => void;
    onHoverPiece?: (id: string | null) => void;
    renderPass?: "bulge" | "line";
};
export default function Piece(props: Props): import("solid-js").JSX.Element;
export {};
