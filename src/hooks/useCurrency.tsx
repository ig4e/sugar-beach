import currencyJs from "currency.js";
import { createContext, useContext, useEffect, useState } from "react";
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: rates } = api.currency.get.useQuery();
  const currencyState = useContext(CurrencyContext);

  if (ignoreCurrency) return currencyJs;

  const currentRate = isClient
    ? rates
      ? {
          currency: currencyState.currency,
          rate: rates[currencyState.currency],
        }
      : defaultCurrency
    : defaultCurrency;

  const currency = (value: currencyJs.Any | undefined = 0) =>
    currencyJs(currencyJs(value).multiply(currentRate.rate), {
      symbol: currentRate.currency,
    });

  return currency;
}

export default useCurrency;
