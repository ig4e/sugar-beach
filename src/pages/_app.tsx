import { ChakraProvider } from "@chakra-ui/react";
import { MantineProvider, type MantineThemeOverride } from "@mantine/core";
import "@uploadthing/react/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CurrencyContext } from "~/hooks/useCurrency";
import { useLocalisationStore } from "~/store/localisation";
import "~/styles/globals.css";
import { customChakraTheme } from "~/theme";
import { mantineLtrCache, mantineRtlCache } from "~/theme/emotion-cache";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { locale } = useRouter();
  const rtl = locale === "ar";

  const customMantineTheme: MantineThemeOverride = {
    primaryColor: "pink",
    defaultRadius: "md",
    primaryShade: 5,
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
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
      theme={customMantineTheme}
      emotionCache={rtl ? mantineRtlCache : mantineLtrCache}
    >
      <SessionProvider session={session}>
        <div className="bg-zinc-100 !font-sans">
          <ChakraProvider theme={chakraTheme}>
            <CurrencyContext.Provider value={{ currency }}>
              <Component {...pageProps} />
            </CurrencyContext.Provider>
          </ChakraProvider>
          <Analytics />
        </div>
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
