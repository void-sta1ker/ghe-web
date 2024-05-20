import {
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Center,
  Checkbox,
  Collapse,
  Flex,
  Group,
  LoadingOverlay,
  NumberFormatter,
  NumberInput,
  Pagination,
  RangeSlider,
  Stack,
  Text,
  Title,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineSort } from "react-icons/md";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { getProductsList } from "@/services";
import ProductCard from "@/components/product-card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  CategoryField,
  DiscountProps,
  ListResponse,
  ProductWithFeedback,
} from "@/types";
import Head from "next/head";

const items = [
  { title: "Home", href: "/" },
  { title: "Catalog", href: "/catalog" },
].map((item) => (
  <Anchor key={item.title} c="blue" href={item.href}>
    {item.title}
  </Anchor>
));

const brands = {
  samsung: false,
  apple: false,
  xiaomi: false,
  asus: false,
  lg: false,
  huawei: false,
  sony: false,
  htc: false,
  motorola: false,
  lenovo: false,
  nokia: false,
  panasonic: false,
  oppo: false,
  vivo: false,
  oneplus: false,
  google: false,
  realme: false,
  infinix: false,
  blackberry: false,
};

function valueLabelFormat(value: number) {
  // const units = ["KB", "MB", "GB", "TB"];
  return <NumberFormatter value={value} suffix=" som" thousandSeparator=" " />;
}

const getScale = (v: number) => v * 10000;

type SortByType = "all" | "most-expensive" | "cheapest";

export default function Category() {
  const router = useRouter();

  const { slug } = router.query;

  const [opened, { toggle: toggleBrands }] = useDisclosure(false);
  const [overlayVisible, { close: closeOverlay, open: openOverlay }] =
    useDisclosure(true);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortByType>("all");

  const [placeholderData, setPlaceholderData] =
    useState<
      ListResponse<ProductWithFeedback & DiscountProps, CategoryField>
    >();

  const [filters, setFilters] = useState({
    min: getScale(0),
    max: getScale(100),
    // brands,
  });

  const products = useQuery({
    queryKey: ["products", slug, page, sortBy, filters],
    queryFn: async () => {
      const { min, max } = filters;

      const res = await getProductsList({
        category: slug as string,
        page,
        limit: 16,
        sortBy,
        min: getScale(min),
        max: getScale(max),
      });
      return res;
    },
    placeholderData: placeholderData ?? {
      results: [],
      count: 0,
      category: { id: "", name: "", description: "" },
    },
    enabled: !!slug,
  });

  console.log(products.data?.results);

  const form = useForm<{
    min: number;
    max: number;
    brands: Record<string, boolean>;
  }>({
    initialValues: {
      min: 0,
      max: 100,
      brands,
    },
  });

  const onSubmit = form.onSubmit((values) => {
    console.log(values);

    setFilters({ min: values.min, max: values.max });
  });

  useEffect(() => {
    if (!products.isFetching && products.data) {
      closeOverlay();
    }

    if (products.isFetching) {
      openOverlay();
    }
  }, [products.isFetching]);

  useEffect(() => {
    if (products.isFetchedAfterMount) {
      setPlaceholderData(products.data);
    }
  }, [products.isFetchedAfterMount]);

  return (
    <>
      <Head>
        <title>{products.data?.category?.name}</title>
      </Head>

      <Stack gap="xl">
        <Breadcrumbs>
          {items}

          <Anchor key={slug as string} c="blue" href={`/catalog/${slug}`}>
            {products.data?.category?.name}
          </Anchor>
        </Breadcrumbs>

        <Stack gap="xs">
          <Title fw={500}>{products.data?.category?.name}</Title>
          <Text>{products.data?.category?.description}</Text>
        </Stack>

        <Flex gap="xl">
          <form onSubmit={onSubmit}>
            <Stack w="200px" gap="xl">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Title fw={500} size="md">
                    Price
                  </Title>

                  <UnstyledButton
                    c="blue"
                    onClick={() => {
                      form.setFieldValue("min", 0);
                      form.setFieldValue("max", 100);
                    }}
                  >
                    Clear
                  </UnstyledButton>
                </Group>

                <RangeSlider
                  thumbSize={26}
                  value={[form.values.min, form.values.max]}
                  onChange={(v) => {
                    form.setFieldValue("min", v[0]);
                    form.setFieldValue("max", v[1]);
                  }}
                  label={valueLabelFormat}
                  scale={getScale}
                  styles={{ thumb: { borderWidth: rem(2), padding: rem(3) } }}
                />
              </Stack>

              <Stack gap="xs">
                <NumberInput
                  size="md"
                  leftSection="from"
                  hideControls
                  styles={{
                    input: { paddingLeft: rem(60) },
                    section: { width: rem(60) },
                  }}
                  value={getScale(form.values.min)}
                  onChange={(v) => {
                    form.setFieldValue("min", +v);
                  }}
                />

                <NumberInput
                  size="md"
                  leftSection="to"
                  hideControls
                  styles={{
                    input: { paddingLeft: rem(60) },
                    section: { width: rem(60), marginLeft: rem(-10) },
                  }}
                  value={getScale(form.values.max)}
                  onChange={(v) => {
                    form.setFieldValue("max", +v);
                  }}
                />
              </Stack>

              <Stack gap="xs">
                <Group justify="space-between">
                  <Title fw={500} size="md">
                    Brands
                  </Title>

                  <UnstyledButton
                    c="blue"
                    onClick={() => {
                      form.setFieldValue("brands", brands);
                    }}
                  >
                    Clear
                  </UnstyledButton>
                </Group>

                <Checkbox
                  label="Samsung"
                  {...form.getInputProps("brands.samsung", {
                    type: "checkbox",
                  })}
                />
                <Checkbox
                  label="Apple"
                  {...form.getInputProps("brands.apple")}
                />
                <Checkbox
                  label="Xiaomi"
                  {...form.getInputProps("brands.xiaomi")}
                />

                <Collapse
                  in={opened}
                  transitionDuration={200}
                  transitionTimingFunction="linear"
                >
                  <Stack gap="xs">
                    <Checkbox
                      label="Asus"
                      {...form.getInputProps("brands.asus")}
                    />
                    <Checkbox label="LG" {...form.getInputProps("brands.lg")} />
                    <Checkbox
                      label="Huawei"
                      {...form.getInputProps("brands.huawei")}
                    />
                    <Checkbox
                      label="Sony"
                      {...form.getInputProps("brands.sony")}
                    />
                    <Checkbox
                      label="HTC"
                      {...form.getInputProps("brands.htc")}
                    />
                    <Checkbox
                      label="Motorola"
                      {...form.getInputProps("brands.motorola")}
                    />
                    <Checkbox
                      label="Lenovo"
                      {...form.getInputProps("brands.lenovo")}
                    />
                    <Checkbox
                      label="Nokia"
                      {...form.getInputProps("brands.nokia")}
                    />
                    <Checkbox
                      label="Panasonic"
                      {...form.getInputProps("brands.panasonic")}
                    />
                    <Checkbox
                      label="Oppo"
                      {...form.getInputProps("brands.oppo")}
                    />
                    <Checkbox
                      label="Vivo"
                      {...form.getInputProps("brands.vivo")}
                    />
                    <Checkbox
                      label="OnePlus"
                      {...form.getInputProps("brands.oneplus")}
                    />
                    <Checkbox
                      label="Google"
                      {...form.getInputProps("brands.google")}
                    />
                    <Checkbox
                      label="Realme"
                      {...form.getInputProps("brands.realme")}
                    />
                    <Checkbox
                      label="Infinix"
                      {...form.getInputProps("brands.infinix")}
                    />
                    <Checkbox
                      label="Blackberry"
                      {...form.getInputProps("brands.blackberry")}
                    />
                  </Stack>
                </Collapse>

                <UnstyledButton c="blue" onClick={toggleBrands}>
                  {opened ? "Show less " : "Show more "}

                  {opened ? (
                    <UpOutlined style={{ fontSize: 12 }} />
                  ) : (
                    <DownOutlined style={{ fontSize: 12 }} />
                  )}
                </UnstyledButton>
              </Stack>

              <Group
                style={{
                  visibility: form.isDirty() ? "visible" : "hidden",
                }}
              >
                <Button
                  variant="subtle"
                  color="red"
                  flex={1}
                  onClick={form.reset}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="subtle" flex={1}>
                  Apply
                </Button>
              </Group>
            </Stack>
          </form>

          <Stack flex={1}>
            <Group>
              <Text component={Group} c="dimmed" gap="4px">
                <MdOutlineSort />
                Sort by
              </Text>

              <UnstyledButton
                c={sortBy === "all" ? "gray" : "blue"}
                onClick={() => {
                  setSortBy("all");
                }}
              >
                All
              </UnstyledButton>

              <UnstyledButton
                c={sortBy === "most-expensive" ? "gray" : "blue"}
                onClick={() => {
                  setSortBy("most-expensive");
                }}
              >
                Most expensive
              </UnstyledButton>

              <UnstyledButton
                c={sortBy === "cheapest" ? "gray" : "blue"}
                onClick={() => {
                  setSortBy("cheapest");
                }}
              >
                Cheapest
              </UnstyledButton>
            </Group>

            <Box pos="relative" h="100%">
              <LoadingOverlay
                visible={overlayVisible}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />

              <Flex gap="xs">
                {products.data?.results?.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    averageRating={product.averageRating}
                    images={product.images}
                    isDiscounted={product.isDiscounted}
                    discountedPrice={product.discountedPrice}
                    quantity={product.quantity}
                    totalReviews={product.totalReviews}
                  />
                ))}
              </Flex>

              {products.data?.results?.length === 0 && (
                <Center h="100%">
                  <Text c="dimmed" fz="lg">
                    No products found
                  </Text>
                </Center>
              )}
            </Box>

            <Pagination total={10} value={page} onChange={setPage} />
          </Stack>
        </Flex>
      </Stack>
    </>
  );
}
