import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Button,
  Center,
  Group,
  NumberInput,
  type NumberInputHandlers,
  SimpleGrid,
  Stack,
  Text,
  Title,
  ColorSwatch,
  NumberFormatter,
  Divider,
  Paper,
  Tabs,
  Collapse,
  UnstyledButton,
  Skeleton,
  Box,
  Breadcrumbs,
  Anchor,
  Rating,
} from "@mantine/core";
import { Carousel, type Embla } from "@mantine/carousel";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Rate } from "antd";
import useAuthStore from "@/hooks/use-auth-store";
import {
  addToCart,
  createCart,
  getCart,
  getProduct,
  getProductReviews,
  getProductsList,
  getWishlist,
  toggleWishlistItem,
} from "@/services";
import LazyImage from "@/components/lazy-image";
import ProductCard from "@/components/product-card";
import {
  CheckOutlined,
  DownOutlined,
  HeartFilled,
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  StarFilled,
  UpOutlined,
} from "@ant-design/icons";
import {
  FaTruck,
  FaExchangeAlt,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";
import queryClient from "@/utils/query-client";
import { isObject } from "radash";
import clsx from "clsx";
import Head from "next/head";
import { SlNote } from "react-icons/sl";

const items = [
  { title: "Home", href: "/" },
  { title: "Catalog", href: "/catalog" },
].map((item) => (
  <Anchor key={item.title} c="blue" href={item.href}>
    {item.title}
  </Anchor>
));

export default function Product() {
  const router = useRouter();

  const { slug } = router.query;

  const handlersRef = useRef<NumberInputHandlers>(null);

  const { isAuth } = useAuthStore();

  const [embla, setEmbla] = useState<Embla | null>(null);

  const [imgIdx, setImgIdx] = useState(0);
  const [itemCount, setItemCount] = useState(1);

  const [opened, { toggle }] = useDisclosure(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await getProduct(slug as string);
      return res;
    },
    placeholderData: {
      id: "",
      name: "",
      description: "",
      price: 0,
      images: [],
      colors: [],
      brand: { _id: "", name: "", isActive: false },
      quantity: 0,
      category: null,
      isDiscounted: false,
      discountedPrice: 0,
    },
    enabled: !!slug,
  });

  console.log(product);

  const products = useQuery({
    queryKey: ["general-products"],
    queryFn: async () => {
      const res = await getProductsList({ generalRecommendation: true });
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0, category: null },
  });

  console.log(products.data);

  const wishlist = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
    enabled: isAuth,
  });

  console.log(wishlist.data);

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    select(data) {
      if (isObject(data)) {
        return data.products;
      }
      return [];
    },
    placeholderData: { products: [], user: "" },
    enabled: isAuth,
  });

  console.log(cart.data);

  const reviews = useQuery({
    queryKey: ["product-reviews"],
    queryFn: async () => {
      const res = await getProductReviews(slug as string);
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
    enabled: !!slug,
  });

  console.log(reviews.data);

  const cartMutation = useMutation({
    mutationFn: async () => {
      const cartId = localStorage.getItem("cartId") ?? "";

      const productDetails = {
        product: product?.id as string,
        quantity: 1,
        totalPrice: product?.isDiscounted
          ? product?.discountedPrice
          : (product?.price as number),
      };

      if (Array.isArray(cart.data) && cartId) {
        const res = await addToCart(cartId, productDetails);
        return res;
      }

      const res = await createCart([productDetails]);
      return res;
    },
    onSuccess(data, variables, context) {
      console.log(data);

      if (data.cartId) {
        localStorage.setItem("cartId", data.cartId);
      }

      void queryClient.invalidateQueries({ queryKey: ["cart"] });

      notifications.show({
        title: "Success!",
        message: "Product added to cart",
        color: "green",
      });
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: async (isLiked: boolean) => {
      const res = await toggleWishlistItem(product?.id as string, isLiked);
      return res;
    },
    onSuccess(data, variables, context) {
      console.log(data);

      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });

      const { isLiked } = data.wishlist;

      notifications.show({
        title: "Success!",
        message: isLiked
          ? "Product added to wishlist"
          : "Product removed from wishlist",
        color: "green",
      });
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  const onAddToCart = () => {
    if (!isAuth) {
      document.getElementById("login")?.click();
      return;
    }

    cartMutation.mutate();
  };

  const onAddToWishlist = () => {
    if (!isAuth) {
      document.getElementById("login")?.click();
      return;
    }

    const { isLiked } = wishlist.data?.find(
      (item) => item.id === product?.id,
    ) ?? { isLiked: false };

    wishlistMutation.mutate(!isLiked);
  };

  const inWishlist =
    wishlist.data?.find((item) => item.id === product?.id)?.isLiked ?? false;

  const inCart =
    !!cart.data?.find((item) => item.product.id === product?.id) ?? false;

  return (
    <>
      <Head>
        <title>{product?.name}</title>
      </Head>

      <Stack gap="50px">
        <Breadcrumbs>
          {items}

          <Anchor
            key={product?.category?.slug}
            href={`/catalog/${product?.category?.slug}`}
            c="blue"
          >
            {product?.category?.name}
          </Anchor>

          <Text key={product?.name} c="dark">
            {product?.name}
          </Text>
        </Breadcrumbs>

        <SimpleGrid cols={2} spacing="xl">
          <SimpleGrid cols={12} spacing="xl">
            <Stack className="col-span-2" gap="4px">
              {product?.images.map((image, idx) => (
                <Center
                  key={image.imageKey}
                  w={66}
                  h={66}
                  className={clsx(
                    "cursor-pointer overflow-hidden rounded",
                    idx === imgIdx ? "border" : "border-transparent",
                  )}
                  onClick={() => {
                    setImgIdx(idx);
                    embla?.scrollTo(idx);
                  }}
                >
                  <LazyImage
                    src={image?.imageUrl}
                    alt="product"
                    // fit="contain"
                    maw={64}
                    mah={64}
                  />
                </Center>
              ))}
            </Stack>

            <Box className="col-span-10">
              <Carousel getEmblaApi={setEmbla} onSlideChange={setImgIdx}>
                {product?.images.map((image) => (
                  <Carousel.Slide key={image.imageKey}>
                    <Center h="100%">
                      <LazyImage
                        src={image?.imageUrl}
                        alt="product"
                        // fit="contain"
                      />
                    </Center>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Box>
          </SimpleGrid>

          <Stack>
            <Group>
              <Rate
                value={reviews.data?.reduce((acc, review, index) => {
                  if (index === 0) {
                    return review.rating;
                  }

                  return (acc + (review.rating ?? 0)) / 2;
                }, 0)}
                allowHalf
                disabled
              />
              <Text c="dimmed">{reviews.data?.length ?? 0} review(s)</Text>
            </Group>

            <Title fw={500}>{product?.name}</Title>

            <Stack gap="0">
              {product?.isDiscounted && (
                <NumberFormatter
                  value={product?.price}
                  suffix=" som"
                  thousandSeparator=" "
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: "red",
                    fontSize: "13px",
                    marginBottom: "-4px",
                    color: "var(--mantine-color-gray-6)",
                  }}
                />
              )}

              <NumberFormatter
                value={
                  product?.isDiscounted
                    ? product?.discountedPrice
                    : product?.price
                }
                suffix=" som"
                thousandSeparator=" "
              />
            </Stack>

            {typeof product?.colors?.length === "number" &&
              product?.colors?.length > 0 && (
                <Stack gap={4}>
                  <Text>Color:</Text>

                  <Group gap="4px">
                    {product?.colors.map((color) => (
                      <ColorSwatch
                        key={color}
                        color={color}
                        className="cursor-pointer"
                      />
                    ))}
                  </Group>
                </Stack>
              )}

            <Stack gap={4}>
              <Text>Quantity:</Text>

              <NumberInput
                handlersRef={handlersRef}
                value={itemCount}
                onChange={(value) => {
                  setItemCount(+value);
                }}
                min={1}
                max={100}
                hideControls
                clampBehavior="strict"
                className="w-24"
                styles={{
                  input: {
                    textAlign: "center",
                    paddingLeft: 34,
                    paddingRight: 34,
                    fontFamily: "Roboto, sans-serif",
                  },
                  section: {
                    width: 34,
                  },
                }}
                leftSection={
                  <ActionIcon
                    variant="white"
                    color="dark"
                    disabled={product?.quantity === 0 || itemCount === 1}
                    onClick={() => {
                      handlersRef.current?.decrement();
                    }}
                  >
                    <MinusOutlined />
                  </ActionIcon>
                }
                rightSection={
                  <ActionIcon
                    variant="white"
                    color="dark"
                    disabled={
                      product?.quantity === 0 || itemCount === product?.quantity
                    }
                    onClick={() => {
                      handlersRef.current?.increment();
                    }}
                  >
                    <PlusOutlined />
                  </ActionIcon>
                }
              />
            </Stack>

            <Group>
              {inCart ? (
                <Button
                  leftSection={<CheckOutlined />}
                  flex={1}
                  onClick={() => {
                    router.push("/cart");
                  }}
                >
                  Go to cart
                </Button>
              ) : (
                <Button
                  leftSection={
                    <ShoppingCartOutlined style={{ fontSize: 18 }} />
                  }
                  flex={1}
                  onClick={onAddToCart}
                  loading={cartMutation.isPending}
                >
                  Add to cart
                </Button>
              )}

              <ActionIcon
                variant="light"
                size="lg"
                onClick={onAddToWishlist}
                loading={wishlistMutation.isPending}
              >
                {inWishlist ? <HeartFilled /> : <HeartOutlined />}
              </ActionIcon>
            </Group>

            <Stack gap={4}>
              <Text size="14px" c="dimmed">
                Seller
              </Text>

              <Group gap={4}>
                <Text>TOP STORE</Text>
                <Group
                  gap={4}
                  bg="#F4F6F7"
                  py={2}
                  px={8}
                  className="rounded-md"
                >
                  <StarFilled style={{ color: "#fadb14", fontSize: 16 }} />
                  <Text c="dark" size="xs">
                    4.5
                  </Text>
                </Group>
              </Group>
            </Stack>

            <Paper p="md" bg="#f4f6f7">
              <Group>
                <FaTruck style={{ color: "#A5B1BB", fontSize: 16 }} />
                <Text>Delivery</Text>
              </Group>

              <Stack gap={4} my="4px">
                <Text c="green" size="14px" ml="lg">
                  Free delivery
                </Text>

                <Text c="#5D6D7D" size="xs" ml="lg">
                  Delivery time: within 1 day throughout Tashkent. Up to 3 days
                  across the country
                </Text>
              </Stack>

              <Divider my="xs" />

              <Group>
                <FaExchangeAlt style={{ color: "#A5B1BB", fontSize: 16 }} />
                <Text>Return policy</Text>
              </Group>
            </Paper>
          </Stack>
        </SimpleGrid>

        <Tabs defaultValue="description">
          <Tabs.List>
            <Tabs.Tab value="description">Description</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description">
            <Text>{product?.description}</Text>

            <Collapse
              in={opened}
              transitionDuration={200}
              transitionTimingFunction="linear"
            >
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <Text key={index}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                ))}
            </Collapse>

            <UnstyledButton component={Group} c="blue" gap={4} onClick={toggle}>
              Full info{" "}
              {opened ? (
                <UpOutlined style={{ fontSize: 12 }} />
              ) : (
                <DownOutlined style={{ fontSize: 12 }} />
              )}
            </UnstyledButton>
          </Tabs.Panel>

          <Tabs.Panel value="reviews">
            {reviews.data?.length === 0 && (
              <Center h="400px">
                <Stack justify="center" align="center">
                  <Center bg="#e3e8ea" p="sm" className="rounded-full">
                    <SlNote fontSize={24} color="#a5b1bb" />
                  </Center>
                  <Text fw={500}>You don't have any reviews yet</Text>
                </Stack>
              </Center>
            )}

            {reviews.data && reviews.data?.length > 0 && (
              <Paper bg="#f4f6f7" p="md" mt="md">
                <SimpleGrid cols={5}>
                  <Text size="14px" fw={500}>
                    Title
                  </Text>
                  <Text size="14px" fw={500} className="col-span-2">
                    Review
                  </Text>
                  <Text size="14px" fw={500}>
                    Rating
                  </Text>
                  <Text size="14px" fw={500}>
                    Recommended
                  </Text>
                </SimpleGrid>

                <Divider my="xs" />

                {reviews.data &&
                  reviews.data?.length > 0 &&
                  reviews.data.map((item) => (
                    <SimpleGrid key={item.product.id} cols={5} mt="md">
                      <Text size="14px">{item.title}</Text>

                      <Text size="14px" className="col-span-2">
                        {item.review}
                      </Text>

                      <Rating value={item.rating} readOnly size="xs" />

                      <Text size="14px">
                        {item.isRecommended ? (
                          <FaRegThumbsUp color="green" />
                        ) : (
                          <FaRegThumbsDown color="red" />
                        )}
                      </Text>
                    </SimpleGrid>
                  ))}
              </Paper>
            )}
          </Tabs.Panel>
        </Tabs>

        <Divider my="xl" />

        <Stack>
          <Title order={2} fw={400}>
            This product in other stores
          </Title>

          {isLoading && (
            <>
              <Skeleton height={20} mt={6} radius="xs" />
              <Skeleton height={20} mt={6} radius="xs" />
            </>
          )}

          <SimpleGrid cols={5}>
            <Group gap={4} className="col-span-2">
              <Text>Iman Shop</Text>
              <Group gap={4} bg="#F4F6F7" py={2} px={8} className="rounded-md">
                <StarFilled style={{ color: "#fadb14", fontSize: 16 }} />
                <Text c="dark" size="xs">
                  4
                </Text>
              </Group>
            </Group>

            <Stack gap={0} className="col-span-2">
              <Text c="dimmed" size="14px">
                Price
              </Text>
              <NumberFormatter
                value={product?.price}
                suffix=" som"
                thousandSeparator=" "
              />
            </Stack>

            <Button size="md">View</Button>
          </SimpleGrid>

          <Divider />

          <SimpleGrid cols={5}>
            <Group gap={4} className="col-span-2">
              <Text>Tel Torg</Text>
              <Group gap={4} bg="#F4F6F7" py={2} px={8} className="rounded-md">
                <StarFilled style={{ color: "#fadb14", fontSize: 16 }} />
                <Text c="dark" size="xs">
                  4.5
                </Text>
              </Group>
            </Group>

            <Stack gap={0} className="col-span-2">
              <Text c="dimmed" size="14px">
                Price
              </Text>
              <NumberFormatter
                value={product?.price}
                suffix=" som"
                thousandSeparator=" "
              />
            </Stack>

            <Button size="md">View</Button>
          </SimpleGrid>
        </Stack>

        <Stack>
          <Title order={2} fw={400}>
            You might be interested in
          </Title>

          <Skeleton visible={products.isLoading}>
            <Group>
              {products.data?.map((product) => (
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
            </Group>
          </Skeleton>
        </Stack>
      </Stack>
    </>
  );
}
