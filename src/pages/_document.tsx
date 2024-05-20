import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
} from "next/document";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { ColorSchemeScript } from "@mantine/core";

function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />

        <ColorSchemeScript defaultColorScheme="auto" />

        <link rel="shortcut icon" href="/greenhaven-transparent.png" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="GreenHaven Express" />
        <meta name="keywords" content="e-commerce, eco-friendly-products" />

        <meta property="og:title" content="GreenHaven Express E-commerce" />
        <meta property="og:description" content="GreenHaven Express" />
        <meta property="og:image" content="/greenhaven.png" />
        {/* og:url */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await NextDocument.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default Document;
