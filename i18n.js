module.exports = {
  locales: ["en", "ar"],
  defaultLocale: "en",
  pages: {
    "*": ["common"],
    "/": ["home"],
    "/cart": ["common", "cart"],
    "/search": ["common", "search"],
    "rgx:^/products": ["common", "product", "productFeedback"],
    "rgx:^/@me": ["common", "account"],
    "/@me": ["accountHome"],
    "rgx:^/dashboard": ["common", "adminDashboard"],
    "/dashboard/discounts": ["common", "adminDashboard", "adminDiscounts"],
    "/auth/signin": ["common", "signIn"],
    "/auth/verify-request": ["common", "verifyRequest"],
    "/404": ["common", "404"],
  },

  loadLocaleFrom: (/** @type {string} */ lang, /** @type {string} */ ns) =>
    // You can use a dynamic import, fetch, whatever. You should
    // return a Promise with the JSON file.
    import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
};
