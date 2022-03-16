import { Properties, Property } from "csstype";

declare namespace React {
  export interface CSSProperties extends Properties<string | number> {
    /**
     * Opacity of the background for Bootstrap background colors
     */
    "--bs-bg-opacity"?: Property.Opacity;
  }
}
