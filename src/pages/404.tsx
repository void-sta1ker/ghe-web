import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { Result } from "antd";
import Head from "next/head";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 | Page Not Found</title>
      </Head>

      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            onClick={() => {
              router.push("/");
            }}
          >
            Back Home
          </Button>
        }
      />
    </>
  );
}
