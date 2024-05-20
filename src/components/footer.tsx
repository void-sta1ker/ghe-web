import Link from "next/link";
import {
  Anchor,
  Box,
  Container,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <Box p="32px" bg="#333333" c="white">
      <Container size="lg" p="0">
        <Group gap="lg" align="start">
          <Stack flex={2} align="start">
            <Stack>
              <Text size="xs">Any questions? Call us</Text>
              <Text size="24px">+998 93 660 45 30</Text>
            </Stack>

            <Group wrap="nowrap" gap="xs">
              <Image src="/google-play.webp" alt="google play" w={150} />
              <Image src="/app-store.png" alt="app store" w={150} />
            </Group>

            <Link href="/locations" className="underline">
              Locations in Tashkent
            </Link>
          </Stack>
          <Stack flex={1} gap="lg">
            <Title order={6}>Company</Title>
            <Stack gap="xs" align="start">
              <Anchor href="#" c="white" size="xs">
                About the company
              </Anchor>
              <Anchor href="#" c="white" size="xs">
                News
              </Anchor>
              <Anchor href="#" c="white" size="xs">
                Contacts
              </Anchor>
              <Anchor href="/merchant" c="white" size="xs">
                Sell with us
              </Anchor>
            </Stack>
          </Stack>
          <Stack flex={1}>
            <Title order={6}>Documents</Title>
          </Stack>
          <Stack flex={1}>
            <Title order={6}>Information</Title>
          </Stack>
        </Group>

        <Divider my="lg" color="gray.7" />

        <Group justify="space-between">
          <Text w="50%" size="xs">
            2024 © greenhavenexpress.com All rights reserved. The indicated
            value of the goods and the terms of their purchase are valid as of
            the current date
          </Text>

          <Group>
            <Link
              href="https://telegram.org"
              className="bg-[#545454] rounded p-2"
            >
              <FaTelegramPlane size={24} />
            </Link>

            <Link
              href="https://instagram.com"
              className="bg-[#545454] rounded p-2"
            >
              <FaInstagram size={24} />
            </Link>

            <Link
              href="https://facebook.com"
              className="bg-[#545454] rounded p-2"
            >
              <FaFacebookF size={24} />
            </Link>
            <Link
              href="https://youtube.com"
              className="bg-[#545454] rounded p-2"
            >
              <FaYoutube size={24} />
            </Link>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
