declare module 'isotope-layout' {
  export interface IsotopeOptions {
    itemSelector?: string;
    layoutMode?: string;
    masonry?: {
      columnWidth?: number | string;
      gutter?: number | string;
    };
    fitRows?: {
      gutter?: number;
    };
    percentPosition?: boolean;
    transitionDuration?: string | number;
    getSortData?: {
      [key: string]: string | ((itemElem: Element) => string | number);
    };
    filter?: string | ((itemElem: Element) => boolean);
    sortBy?: string | string[];
    sortAscending?: boolean | { [key: string]: boolean };
  }

  export default class Isotope {
    constructor(element: Element | string, options?: IsotopeOptions);
    arrange(options?: IsotopeOptions): void;
    destroy(): void;
    layout(): void;
    reloadItems(): void;
    updateSortData(elements?: Element | Element[]): void;
  }
}
