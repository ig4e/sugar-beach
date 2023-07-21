import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar-sa";
import useTranslation from "next-translate/useTranslation";
import type { Locale } from "~/types/locale";

function useDayjs() {
  const { lang } = useTranslation();
  const locale = lang as Locale;
  const dayjsInstance = (
    date?: string | number | dayjs.Dayjs | Date | null | undefined
  ) => dayjs(date).locale(locale === "ar" ? "ar-sa" : "en");

  return dayjsInstance;
}

export default useDayjs;
