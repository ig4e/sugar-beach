import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { alertTheme } from "./components/alert";
import { badgeTheme } from "./components/badge";
import { buttonTheme } from "./components/button";
import { checkboxTheme } from "./components/checkbox";
import { inputTheme } from "./components/input";
import { dividerTheme } from "./components/divider";

export const customChakraTheme = (dir: "ltr" | "rtl" = "ltr") =>
  extendTheme(
    {
      colors: {
        pink: {
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
      },
      components: {
        Badge: badgeTheme,
        Button: buttonTheme,
        Checkbox: checkboxTheme,
        Input: inputTheme,
        Alert: alertTheme,
        Divider: dividerTheme,
      },
      direction: dir,
      breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    withDefaultColorScheme({ colorScheme: "pink" })
  );
