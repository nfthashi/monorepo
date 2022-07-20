import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles = {
  global: (props: Dict) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("#F7F7F8", "gray.800")(props),
    },
  }),
};

const colors = {
  primary: {
    main: "#D70209",
    sub: "#F7F7F8",
  },
  secondary: {
    main: "#898FFF",
  },
  gray: {
    light: "#8E8E8E",
    dark: "#706C6E",
  },
  success: {
    main: "#00C851",
  },
  warning: {
    main: "#FFBB33",
  },
  info: {
    main: "33B5E5",
  },
};

const theme = extendTheme({ config, styles, colors });

export default theme;
