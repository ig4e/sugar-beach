import { useLocale } from "next-intl";
import type { Locale } from "~/types/locale";

function useDrawerPlacment() {
  const locale = useLocale() as Locale;
  return locale === "en" ? "right" : ("left" as const);
}

export default useDrawerPlacment;
