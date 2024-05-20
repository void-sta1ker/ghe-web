import { useRouter } from "next/router";
import { Accordion, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { PiOfficeChairFill, PiPaintBrushHouseholdFill } from "react-icons/pi";
import { GiFruitBowl, GiHealthNormal, GiHighHeel } from "react-icons/gi";
import { IoGlasses } from "react-icons/io5";
import { FaTshirt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services";
import classes from "@/styles/styles.module.css";

const iconMap = {
  "household-appliances": <PiPaintBrushHouseholdFill />,
  healthcare: <GiHealthNormal />,
  "office-supplies": <PiOfficeChairFill />,
  "organic-food": <GiFruitBowl />,
};

interface Props {
  closeDrawer: () => void;
}

export default function CatalogMenu(props: Props) {
  const { closeDrawer } = props;

  const router = useRouter();

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
  });

  return (
    <Accordion variant="filled">
      <Stack>
        {categories.data?.map((category) => (
          <UnstyledButton
            key={category.id}
            className={classes.control}
            onClick={() => {
              router.push(`/catalog/${category.slug}`);
              closeDrawer();
            }}
          >
            {iconMap[category.slug as keyof typeof iconMap]}

            {category.name}
          </UnstyledButton>
        ))}

        <Accordion.Item value="fashion">
          <Accordion.Control className="hover:bg-[#f8f9fa] rounded-md">
            <Group gap={10}>
              <IoGlasses />
              <Text fw={500}>Fashion</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <UnstyledButton
                className={classes.control}
                onClick={() => {
                  router.push("/catalog/fashion/men");
                  closeDrawer();
                }}
              >
                <FaTshirt />
                Men's clothing
              </UnstyledButton>
              <UnstyledButton
                className={classes.control}
                onClick={() => {
                  router.push("/catalog/fashion/women");
                  closeDrawer();
                }}
              >
                <GiHighHeel />
                Women's clothing
              </UnstyledButton>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Stack>
    </Accordion>
  );
}
