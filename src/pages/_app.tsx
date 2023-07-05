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
import { customChakraTheme } from "~/theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const customMantineTheme: MantineThemeOverride = {
    primaryColor: "pink",
    defaultRadius: "md",
    components: {},
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
