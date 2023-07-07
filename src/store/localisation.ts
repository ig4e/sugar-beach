import { Countries } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const countryToCurrency = {
  BH: "BHD",
  KW: "KWD",
  IQ: "IQD",
  OM: "OMR",
  QA: "QAR",
  SA: "SAR",
  AE: "AED",
} as const;

type ValueOf<T> = T[keyof T];

interface LocalisationState {
  country: Countries;
  currency: ValueOf<typeof countryToCurrency>;
  setCountry: (country: Countries) => void;
}

export const useLocalisationStore = create<LocalisationState>()(
  devtools(
    persist(
      (set) => ({
        country: "SA",
        currency: countryToCurrency.SA,
        setCountry: (country) =>
          set({ country, currency: countryToCurrency[country] }),
      }),
      { name: "country-state" }
    )
  )
);
