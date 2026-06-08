export type Lang = "en" | "nl";
export type Strings = {
    paused: string;
    max: string;
    pauseAriaLabel: string;
    playAriaLabel: string;
    speedAriaLabel: string;
    resetButton: string;
    entropy: string;
    gini: string;
    trackLength: string;
    utilized: string;
    bidirectional: string;
    traveled: string;
    trackLabel: string;
    graphLabel: string;
    morphAriaLabel: string;
};
export declare function t(lang: Lang | undefined): Strings;
