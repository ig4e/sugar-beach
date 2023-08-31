export const COUNTRIES = [
  {
    name: "Saudi Arabia",
    code: "SA",
    mobileCode: "+966",
    flag: "https://flagcdn.com/h240/sa.webp",
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    mobileCode: "+971",
    flag: "https://flagcdn.com/h240/ae.webp",
  },
  {
    name: "Qatar",
    code: "QA",
    mobileCode: "+974",
    flag: "https://flagcdn.com/h240/qa.webp",
  },
  {
    name: "Kuwait",
    code: "KW",
    mobileCode: "+965",
    flag: "https://flagcdn.com/h240/kw.webp",
  },
  {
    name: "Bahrain",
    code: "BH",
    mobileCode: "+973",
    flag: "https://flagcdn.com/h240/bh.webp",
  },
  {
    name: "Oman",
    code: "OM",
    mobileCode: "+968",
    flag: "https://flagcdn.com/h240/om.webp",
  },
] as const;

export const COUNTRIES_NAME = {
  BH: "Bahrain",
  KW: "Kuwait",
  OM: "Oman",
  QA: "Qatar",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
} as const;

export const DEFAULT_PAGE_SIZE = 25;
