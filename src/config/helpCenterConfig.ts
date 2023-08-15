type LocalizedText = {
  en: string;
  ar: string;
};

export const HELP_CENTER_PAGES: {
  title: LocalizedText;
  description: LocalizedText;
  path: string;
}[] = [
  {
    title: {
      en: "About Us",
      ar: "من نحن",
    },
    description: {
      en: "About sugar beach and how we work",
      ar: "من نحن وكيف نعمل",
    },
    path: "about-us",
  },
  {
    title: { en: "Contact Us", ar: "تواصل معنا" },
    description: {
      en: "Contact us for any questions",
      ar: "أتصل بنا من اجل اى سؤال",
    },
    path: "contact-us",
  },
  {
    title: { en: "FAQ", ar: "الأسئلة الشائعة" },
    description: {
      en: "Frequently asked questions",
      ar: "الأسئلة المعاد سئلها كثيرا",
    },
    path: "faq",
  },
  {
    title: {
      en: "Privacy Policy",
      ar: "سياسة الخصوصية",
    },
    description: { en: "Our privacy policy", ar: "سياسة خصوصيتنا" },
    path: "privacy-policy",
  },
  {
    title: { en: "Terms of Use", ar: "شروط الاستخدام" },
    description: { en: "Our terms of Use", ar: "شروط الاستخدام الموقع" },
    path: "terms-of-use",
  },
  {
    title: { en: "Terms of Sale", ar: "شروط البيع" },
    description: { en: "Our terms of sale", ar: "شروطنا للبيع" },
    path: "terms-of-sale",
  },
  {
    title: { en: "Refund Policy", ar: "شروط الارجاع" },
    description: { en: "Our refund policy", ar: "شروطنا للأرجاع" },
    path: "refund-policy",
  },
];
