import {
  ActionIcon,
  Divider,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import Head from "next/head";
import Script from "next/script";
import { FaAngleDown } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const apiKey = process.env.NEXT_PUBLIC_YMAPS_API_KEY;

export default function Locations() {
  return (
    <>
      <Head>
        <title>Locations</title>
      </Head>

      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=en_US`}
        type="text/javascript"
        onReady={() => {
          function init() {
            var myMap = new window.ymaps.Map("map", {
              center: [41.311153, 69.279729],
              zoom: 12,
            });

            // put placemarks
            var coords = [
              [41.283178, 69.31186],
              [41.367297, 69.315714],
              [41.33077, 69.224504],
              [41.30964, 69.310136],
            ];

            var myCollection = new window.ymaps.GeoObjectCollection(
              {},
              // {
              //   preset: "islands#redIcon", //all placemarks are red
              // },
            );

            for (var i = 0; i < coords.length; i++) {
              myCollection.add(new ymaps.Placemark(coords[i], {}));
            }

            myMap.geoObjects.add(myCollection);

            // coords.forEach((coord) => {
            //   var myPlacemark = new ymaps.Placemark(coord);
            // });
          }

          if (
            typeof window !== "undefined" &&
            typeof window.ymaps !== "undefined"
          ) {
            window.ymaps.ready(init);
          }
        }}
      ></Script>

      <Group align="baseline" mb="1rem">
        <Title order={2}>Our stores</Title>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton c="blue" component={Group} gap="4px">
              <Text size="18px" fw={500}>
                All
              </Text>{" "}
              <FaAngleDown />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            {/* <Menu.Label>Application</Menu.Label> */}
            <Menu.Item>All</Menu.Item>
            {/* <Menu.Divider /> */}
          </Menu.Dropdown>
        </Menu>
      </Group>

      <SimpleGrid
        cols={4}
        component={Paper}
        p="lg"
        bg="#f4f6f7"
        className="border border-gray"
      >
        <Stack gap="xl">
          <TextInput
            placeholder="Search"
            rightSection={
              <ActionIcon
                variant="transparent"
                color="gray"
                className="hover:text-[#40C057]"
              >
                <FiSearch />
              </ActionIcon>
            }
          />

          <Stack
            className="col-span-1"
            gap="xs"
            component={UnstyledButton}
            onClick={() => {}}
          >
            {locations.map((loc) => (
              <>
                <Stack key={loc.title} gap="xs">
                  <Title order={6} fw={500}>
                    {loc.title}
                  </Title>
                  <Text c="dimmed" size="12px">
                    {loc.workingHours}
                  </Text>
                </Stack>
                <Divider my="xs" />
              </>
            ))}
          </Stack>
        </Stack>

        <div
          id="map"
          style={{ width: "100%", height: "600px" }}
          className="col-span-3"
        />
      </SimpleGrid>
    </>
  );
}

const locations = [
  {
    title: "Ferghana Yuli Store",
    workingHours: "09:00-21:00",
    coords: [41.311153, 69.279729],
  },
  {
    title: "Aviasozlar Store",
    workingHours: "08:00-20:00",
    coords: [41.311153, 69.279729],
  },
  {
    title: "Tinchlik Store",
    workingHours: "08:00-18:00",
    coords: [41.311153, 69.279729],
  },
  {
    title: "Yunusabad Store",
    workingHours: "10:00-22:00",
    coords: [41.311153, 69.279729],
  },
];
