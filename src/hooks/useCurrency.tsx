import { Countries } from "@prisma/client";
import currencyJs from "currency.js";
import { createContext, useContext } from "react";

const currencyToCurrency = {
  BH: "BHD",
  KW: "KWD",
  IQ: "IQD",
  OM: "OMR",
  QA: "QAR",
  SA: "SAR",
  AE: "AED",
} as const;

type ValueOf<T> = T[keyof T];

interface currencyState {
  currency: ValueOf<typeof currencyToCurrency>;
}

export const CurrencyContext = createContext<currencyState>({
  currency: "SAR",
});

function useCurrency() {
  const currencyState = useContext(CurrencyContext);

  const currency = (value: number) =>
    currencyJs(value, { symbol: currencyState.currency });

  return currency;
}

export default useCurrency;
