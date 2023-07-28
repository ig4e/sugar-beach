import { ServerStyles, createStylesServer } from "@mantine/next";
import Document, {
  type DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { mantineLtrCache, mantineRtlCache } from "~/theme/emotion-cache";

const ltrStylesServer = createStylesServer(mantineLtrCache);
const rtlStylesServer = createStylesServer(mantineRtlCache);

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const rtl = ctx.locale === "ar";

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          server={rtl ? rtlStylesServer : ltrStylesServer}
          key="styles"
        />,
      ],
    };
  }
  render() {
    const { locale } = this.props.__NEXT_DATA__;
    const dir = locale === "ar" ? "rtl" : "ltr";
    return (
      <Html>
        <Head />
        <body dir={dir} lang={locale}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
