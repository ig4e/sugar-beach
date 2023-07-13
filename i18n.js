module.exports = {
  locales: ["en", "ar"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["home"],
    "/cart": ["cart"],
    "/search": ["search"],
    "rgx:^/products": ["product", "productFeedback"],
    "rgx:^/@me": ["account"],
    "/@me": ["accountHome"],
    "/@me/addresses": ["accountAddresses"],
    "rgx:^/dashboard": ["adminDashboard"],
    "/dashboard/discounts": ["adminDashboard", "adminDiscounts"],
    "/auth/signin": ["signIn"],
    "/auth/verify-request": ["verifyRequest"],
    "/404": ["404"],
  },

  loadLocaleFrom: (/** @type {string} */ lang, /** @type {string} */ ns) =>
    // You can use a dynamic import, fetch, whatever. You should
    // return a Promise with the JSON file.
    import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
};
