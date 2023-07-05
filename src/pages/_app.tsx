import { ChakraProvider } from "@chakra-ui/react";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/globals.css";
import { api } from "~/utils/api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
    fontFamily: 'Inter, Arial, sans-serif',
  };


  return (
    <div className="!font-inter">
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={customMantineTheme}
      >
        <ChakraProvider theme={customChakraTheme}>
          <SessionProvider session={session}>
            <CurrencyContext.Provider value={{ country: "SA" }}>
              <Component {...pageProps} />
            </CurrencyContext.Provider>
          </SessionProvider>
        </ChakraProvider>
      </MantineProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
