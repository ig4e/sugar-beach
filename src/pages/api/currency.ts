import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import currencyJs from "currency.js";
import axios from "axios";
import type { CurrencyRates } from "@prisma/client";

type Data = {
  success: boolean;
  rates?: CurrencyRates;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const key = req.query.key;

  if (key !== "2550af54-960a-4101-83a4-3e866da2eb87")
    return res.status(401).json({ success: false });

  const { data: apiResponse } = await axios<CurrencyApiRates>({
    url: "https://currencyapi.net/api/v1/rates?key=Vq1PwGve8veAMpPm4Se0Nqb9Yi7SXyUmYnsR",
  });

  const newRates: Partial<typeof apiResponse.rates> = {};
  for (const currencyKey in apiResponse.rates) {
    const currency = currencyKey;
    const rate = apiResponse.rates[currency];
    if (rate && apiResponse.rates.SAR) {
      const rateInSAR = currencyJs(rate, { precision: 4 }).divide(
        apiResponse.rates.SAR
      );
      newRates[currency] = rateInSAR.value;
    }
  }

  if (
    newRates.AED &&
    newRates.BHD &&
    newRates.IQD &&
    newRates.KWD &&
    newRates.OMR &&
    newRates.QAR &&
    newRates.SAR
  ) {
    const currencyUpdate = await prisma.currencyRates.upsert({
      where: { id: "_currency" },
      create: {
        id: "_currency",
        AED: newRates.AED,
        BHD: newRates.BHD,
        IQD: newRates.IQD,
        KWD: newRates.KWD,
        OMR: newRates.OMR,
        QAR: newRates.QAR,
        SAR: newRates.SAR,
      },
      update: {
        AED: newRates.AED,
        BHD: newRates.BHD,
        IQD: newRates.IQD,
        KWD: newRates.KWD,
        OMR: newRates.OMR,
        QAR: newRates.QAR,
        SAR: newRates.SAR,
      },
    });

    return res.status(200).json({ success: true, rates: currencyUpdate });
  }

  return res.status(200).json({ success: true });
}

type CurrencyApiRates = {
  valid: boolean;
  updated: number;
  base: "USD";
  rates: {
    [index: string]: number;
  };
};
