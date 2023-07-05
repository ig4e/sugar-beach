export const COUNTRIES = [
  { name: "Bahrain", code: "BH", mobileCode: "+973" },
  { name: "Kuwait", code: "KW", mobileCode: "+965" },
  { name: "Oman", code: "OM", mobileCode: "+968" },
  { name: "Qatar", code: "QA", mobileCode: "+974" },
  { name: "Saudi Arabia", code: "SA", mobileCode: "+966" },
  { name: "United Arab Emirates", code: "AE", mobileCode: "+971" },
] as const;

export const COUNTRIES_NAME = {
  BH: "Bahrain",
  KW: "Kuwait",
  OM: "Oman",
  QA: "Qatar",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
} as const;
