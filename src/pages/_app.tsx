import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
  baseTheme,
} from "@chakra-ui/react";
import "~/styles/globals.css";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";

import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import { CurrencyContext } from "~/hooks/useCurrency";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const customChakraTheme = extendTheme(
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
    },
    withDefaultColorScheme({ colorScheme: "pink" })
  );

  const customMantineTheme: MantineThemeOverride = {
    primaryColor: "pink",
    colors: {
      pink: [
        "#fdf2f8",
        "#fce7f3",
        "#fbcfe8",
        "#f9a8d4",
        "#f472b6",
        "#ec4899",
        "#db2777",
        "#be185d",
        "#9d174d",
        "#831843",
      ],
    },
  };

  return (
    <div className="!font-inter">
      <CurrencyContext.Provider value={{ country: "SA" }}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={customMantineTheme}
        >
          <ChakraProvider theme={customChakraTheme}>
            <SessionProvider session={session}>
              <Component {...pageProps} />
            </SessionProvider>
          </ChakraProvider>
        </MantineProvider>
      </CurrencyContext.Provider>
    </div>
  );
};

export default api.withTRPC(MyApp);
