import { createMerchant } from "@/services";
import {
  Button,
  Center,
  Divider,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";
import { PatternFormat } from "react-number-format";

export default function Merchant() {
  const form = useForm({
    initialValues: {
      name: "",
      phoneNumber: "",
      brandName: "",
      business: "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Too short" : null),
      phoneNumber: (value) => (value.length < 2 ? "Too short" : null),
      brandName: (value) => (value.length < 2 ? "Too short" : null),
      business: (value) => (value.length < 2 ? "Too short" : null),
    },
  });

  const merchantMutation = useMutation({
    mutationFn: createMerchant,
    onSuccess: (data) => {
      console.log(data);

      form.reset();

      notifications.show({
        title: "Success!",
        message:
          "Your request has been submitted successfully. We will contact you soon.",
        color: "green",
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

  return (
    <>
      <Head>
        <title>Become a GHE seller!</title>
      </Head>

      <Title order={3} fw={400}>
        Become a GHE seller!
      </Title>

      <Divider my="md" />

      <SimpleGrid cols={2} spacing="xl">
        <form onSubmit={onSubmit}>
          <Stack gap="lg">
            <TextInput
              label="Name"
              placeholder="Full name"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("name")}
            />

            <PatternFormat
              customInput={TextInput}
              format="+998 ## ### ## ##"
              mask="_"
              label="Phone number"
              placeholder="+998"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("phoneNumber")}
            />

            <TextInput
              label="Brand"
              placeholder="Business brand"
              styles={{ input: { height: "44px" } }}
              {...form.getInputProps("brandName")}
            />

            <Textarea
              label="Business"
              placeholder="Please, describe your business"
              rows={5}
              minRows={5}
              maxRows={15}
              styles={{
                input: { paddingTop: ".8rem", paddingBottom: ".8rem" },
              }}
              {...form.getInputProps("business")}
            />

            <Button
              type="submit"
              variant="outline"
              className="self-start"
              loading={merchantMutation.isPending}
            >
              Submit
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
