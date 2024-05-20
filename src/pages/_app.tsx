import "@/styles/globals.css";
import type { AppProps } from "next/app";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import { ConfigProvider, type ThemeConfig } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import DefaultLayout from "@/layout/default-layout";
import { LangProvider } from "@/providers";
import queryClient from "@/utils/query-client";

const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: "green",
  fontFamily: "Roboto, sans-serif",
});

const antTheme: ThemeConfig = {
  token: {
    // colorPrimary:
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />

      <LangProvider>
        <MantineProvider theme={theme}>
          <Notifications />
          <ConfigProvider theme={antTheme}>
            <DefaultLayout>
              <Component {...pageProps} />
            </DefaultLayout>
          </ConfigProvider>
        </MantineProvider>
      </LangProvider>
    </QueryClientProvider>
  );
}
