import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
  return (
    <Html>
     <Head>
        <Script
          src="https://polyfill.io/v3/polyfill.min.js?features=fetch"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.moyasar.com/mpf/1.7.3/moyasar.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body className="bg-zinc-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
