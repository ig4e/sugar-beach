import { ChakraProvider } from "@chakra-ui/react";
import {
  MantineProvider,
  createEmotionCache,
  type MantineThemeOverride,
} from "@mantine/core";
import "@uploadthing/react/styles.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import stylisRTLPlugin from "stylis-plugin-rtl";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CurrencyContext } from "~/hooks/useCurrency";
import { useLocalisationStore } from "~/store/localisation";
import "~/styles/globals.css";
import { customChakraTheme } from "~/theme";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { locale } = useRouter();
  const rtl = locale === "ar";

  const rtlCache = createEmotionCache({
    key: "mantine-rtl",
    stylisPlugins: [stylisRTLPlugin],
  });

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
    fontFamily: "Inter, Noto Kufi Arabic, sans-serif",
    dir: rtl ? "rtl" : "ltr",
  };

  const currency = useLocalisationStore((state) => state.currency);
  const chakraTheme = customChakraTheme(rtl ? "rtl" : "ltr");

  return (
    <div className="!font-inter bg-zinc-100">
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          withCSSVariables
          theme={customMantineTheme}
          emotionCache={rtl ? rtlCache : undefined}
        >
          <ChakraProvider theme={chakraTheme}>
            <CurrencyContext.Provider value={{ currency }}>
              <Component {...pageProps} />
            </CurrencyContext.Provider>
          </ChakraProvider>
        </MantineProvider>
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
