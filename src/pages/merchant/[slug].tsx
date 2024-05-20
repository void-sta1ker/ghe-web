import { signUpMerchant } from "@/services";
import {
  Button,
  Center,
  Divider,
  Image,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Head from "next/head";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PatternFormat } from "react-number-format";

export default function MerchantSignUp() {
  const { slug } = useParams() ?? {};

  const searchParams = useSearchParams();

  const router = useRouter();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
    },
    validate: {
      firstName: (value) => (value.length < 2 ? "Too short" : null),
      lastName: (value) => (value.length < 2 ? "Too short" : null),
      phoneNumber: (value) => (value.length < 2 ? "Too short" : null),
      password: (value) => (value.length < 2 ? "Too short" : null),
    },
  });

  const merchantMutation = useMutation({
    mutationFn: async (payload: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      password: string;
    }) => {
      const res = await signUpMerchant(slug as string, payload);
      return res;
    },
    onSuccess: (data) => {
      console.log(data);

      form.reset();

      notifications.show({
        title: "Success!",
        message: "Welcome on board! Now you can login to your account.",
        color: "green",
      });

      router.replace("/");
    },
    onError: (res: AxiosResponse) => {
      console.error(res);

      notifications.show({
        title: "Error",
        message: res.data?.message,
        color: "red",
      });
    },
  });

  const onSubmit = form.onSubmit((values) => {
    console.log(values);

    merchantMutation.mutate({
      ...values,
      phoneNumber: values.phoneNumber.replace(/\D/g, ""),
    });
  });

  useEffect(() => {
    const phone = searchParams.get("phone_number") ?? "";

    if (phone) {
      form.setFieldValue("phoneNumber", `+${phone}`);
    }
  }, [searchParams]);

  return (
    <>
      <Head>
        <title>Merchant sign up</title>
      </Head>

      <Title order={3} fw={400}>
        Complete sign up
      </Title>

      <Divider my="md" />

      <SimpleGrid cols={2} spacing="xl">
        <form onSubmit={onSubmit}>
          <Stack gap="lg">
            <TextInput
              label="First name"
              placeholder="Please, enter your first name"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("firstName")}
            />

            <TextInput
              label="Last name"
              placeholder="Please, enter your last name"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("lastName")}
            />

            <PatternFormat
              customInput={TextInput}
              format="+998 ## ### ## ##"
              mask="_"
              label="Phone number"
              placeholder="+998"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("phoneNumber")}
              disabled
            />

            <PasswordInput
              label="Password"
              placeholder="Please, enter your password"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("password")}
            />

            <Button
              type="submit"
              variant="outline"
              className="self-start"
              loading={merchantMutation.isPending}
            >
              Get started
            </Button>
          </Stack>
        </form>

        <Stack gap="xl">
          <Paper bg="#f6f7f8" component={Stack} gap="xs" ta="center" p="xl">
            <Title order={4} fw={500}>
              Would you like to sell your products on GHE store?
            </Title>
            <Text>Grow your business with GHE store</Text>
            <Text c="dimmed" fw={700} size="14px">
              Apply today
            </Text>
          </Paper>

          <Center>
            <Image
              src="https://mern-store-gold.vercel.app/images/banners/agreement.svg"
              alt="agreement"
              maw={250}
            />
          </Center>
        </Stack>
      </SimpleGrid>
    </>
  );
}
