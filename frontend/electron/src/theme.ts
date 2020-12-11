import { createGlobalStyle } from "styled-components";

import CharlieDisplayRegular from "./fonts/CharlieDisplay/CharlieDisplay-Regular.otf";

const GlobalTheme = createGlobalStyle`
    @font-face {
    font-family: "Charlie Display";
    src: local("Charlie Display Regular"),
      url(${CharlieDisplayRegular}) format("woff");
    font-weight: 400;
    font-style: normal
    }
`;

export default GlobalTheme;
