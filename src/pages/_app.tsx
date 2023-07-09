import { ChakraProvider } from "@chakra-ui/react";
import {
  MantineProvider,
  createEmotionCache,
  type MantineThemeOverride,
} from "@mantine/core";
import "@uploadthing/react/styles.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
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

import enMessages from "public/locales/en.json";
import arMessages from "public/locales/ar.json";

const MyApp: AppType<{ session: Session | null; messages: Messages }> = ({
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
    <div className="bg-zinc-100 !font-inter">
      <NextIntlClientProvider
        messages={locale === "ar" ? arMessages : enMessages}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={customMantineTheme}
          emotionCache={rtl ? rtlCache : undefined}
        >
          <ChakraProvider theme={chakraTheme}>
            <SessionProvider session={session}>
              <CurrencyContext.Provider value={{ currency }}>
                <Component {...pageProps} />
              </CurrencyContext.Provider>
            </SessionProvider>
          </ChakraProvider>
        </MantineProvider>
      </NextIntlClientProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
