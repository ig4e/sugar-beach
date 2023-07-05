import { Countries } from "@prisma/client";
import currencyJs from "currency.js";
import { createContext, useContext } from "react";

interface CurrencyState {
  country: Countries;
}

export const CurrencyContext = createContext<CurrencyState>({ country: "SA" });

function useCurrency() {
  const currencyState = useContext(CurrencyContext);

  const countryToCurrency = {
    BH: "BHD",
    KW: "KWD",
    IQ: "IQD",
    OM: "OMR",
    QA: "QAR",
    SA: "SAR",
    AE: "AED",
  };

  const currency = (value: number) =>
    currencyJs(value, { symbol: countryToCurrency[currencyState.country] });

  return currency;
}

export default useCurrency;
