import { Countries } from "@prisma/client";
import currencyJs from "currency.js";
import { BooleanArraySupportOption } from "prettier";
import { createContext, useContext } from "react";
import { api } from "~/utils/api";

export const currencyToCurrency = {
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

const defaultCurrency = {
  currency: "SAR",
  rate: 1,
};

function useCurrency(ignoreCurrency = false) {
  const { data: rates } = api.currency.get.useQuery();
  const currencyState = useContext(CurrencyContext);

  if (ignoreCurrency) return currencyJs;

  const currency = (value: currencyJs.Any) =>
    currencyJs(
      currencyJs(value).multiply(
        rates ? rates[currencyState.currency] : defaultCurrency.rate
      ),
      {
        symbol: rates ? currencyState.currency : defaultCurrency.currency,
      }
    );

  return currency;
}

export default useCurrency;
