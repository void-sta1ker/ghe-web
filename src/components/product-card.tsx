import Link from "next/link";
import {
  CheckOutlined,
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  ActionIcon,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { Badge, Rate } from "antd";
import formatAmount from "@/helpers/format-amount";
import type { DiscountProps, ProductWithFeedback } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addToCart,
  createCart,
  getCart,
  getWishlist,
  toggleWishlistItem,
} from "@/services";
import queryClient from "@/utils/query-client";
import useAuthStore from "@/hooks/use-auth-store";
import { isObject } from "radash";
import calcDiscountPc from "@/helpers/calc-discount-percent";
import Ribbon from "./ribbon";
import LazyImage from "./lazy-image";

interface Props
  extends Pick<
    ProductWithFeedback,
    | "id"
    | "images"
    | "name"
    | "price"
    | "averageRating"
    | "totalReviews"
    | "quantity"
  > {
  onLike?: () => void;
  onCart?: () => void;
}

export default function ProductCard(props: Props & DiscountProps) {
  const {
    id,
    images,
    name,
    price,
    averageRating: rating,
    isDiscounted,
    discountedPrice,
    quantity,
    totalReviews,
    onLike = () => {},
    onCart = () => {},
  } = props;

  const { isAuth } = useAuthStore();

  const wishlist = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    select(data) {
      return data.results.filter((item) => item && item.isLiked);
    },
    placeholderData: { results: [], count: 0 },
    enabled: isAuth,
  });

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

  const wishlistMutation = useMutation({
    mutationFn: async (isLiked: boolean) => {
      const res = await toggleWishlistItem(id, isLiked);
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

  const cartMutation = useMutation({
    mutationFn: async () => {
      const cartId = localStorage.getItem("cartId") ?? "";

      const productDetails = {
        product: id,
        quantity: 1,
        totalPrice: price,
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

  const onAddToWishlist = () => {
    if (!isAuth) {
      document.getElementById("login")?.click();
      return;
    }

    const { isLiked } = wishlist.data?.find((item) => item.id === id) ?? {
      isLiked: false,
    };

    wishlistMutation.mutate(!isLiked);
  };

  const onAddToCart = () => {
    if (!isAuth) {
      document.getElementById("login")?.click();
      return;
    }

    cartMutation.mutate();
  };

  const inWishlist = wishlist.data?.findIndex((item) => item.id === id) !== -1;

  const inCart =
    cart.data !== undefined &&
    cart.data?.findIndex((item) => item.product.id === id) !== -1;

  const isMobile = useMediaQuery("(max-width: 767px)") ?? false;

  return (
    <Ribbon
      text={`-${calcDiscountPc(price, discountedPrice)}%`}
      color="red"
      show={isDiscounted}
    >
      <Card
        withBorder
        shadow="sm"
        w={isMobile ? "150px" : "215px"}
        h={isMobile ? "250px" : "300px"}
        component={Stack}
        style={{ justifyContent: "space-between" }}
      >
        <Card.Section>
          <Center>
            <Flex
              component={Link}
              href={`/products/${id}`}
              justify="center"
              align="center"
              w={isMobile ? "65px" : "150px"}
              h={isMobile ? "65px" : "150px"}
            >
              <LazyImage
                src={images?.[0]?.imageUrl}
                fit="contain"
                alt="product image"
                w={isMobile ? "65px" : "150px"}
                className={isMobile ? "max-h-[65px]" : "max-h-[150px]"}
              />
            </Flex>
          </Center>
        </Card.Section>

        <Stack flex={1} justify="space-between">
          <Stack gap="4px" align="start">
            <Text
              component={Link}
              href={`/products/${id}`}
              size="sm"
              className="hover:text-gray-500 hover:underline cursor-pointer transition line-clamp-1"
            >
              {name}
            </Text>

            <Group align="baseline">
              <Rate
                disabled
                allowHalf
                value={rating}
                style={{ fontSize: isMobile ? "10px" : "16px" }}
              />

              <Text size="10px" c="dimmed">
                {totalReviews} review(s)
              </Text>
            </Group>

            <Text size="13px" mt="4px">
              In stock: {quantity}
            </Text>
          </Stack>

          <Stack gap="0" style={{ justifySelf: "flex-end" }}>
            <Text
              size={isMobile ? "10px" : "11px"}
              c="dimmed"
              style={{
                textDecoration: "line-through",
                marginBottom: "-4px",
              }}
            >
              {isDiscounted && `${formatAmount(price)} som`}
            </Text>

            <Group justify="space-between">
              <Text size={isMobile ? "12px" : "14px"} fw={500}>
                {formatAmount(isDiscounted ? discountedPrice : price)} som
              </Text>

              <Group gap="4px">
                <ActionIcon
                  variant="transparent"
                  loading={wishlistMutation.isPending}
                  onClick={onAddToWishlist}
                >
                  {inWishlist ? <HeartFilled /> : <HeartOutlined />}
                </ActionIcon>

                <ActionIcon
                  variant="outline"
                  loading={cartMutation.isPending}
                  onClick={onAddToCart}
                >
                  {inCart ? <CheckOutlined /> : <ShoppingCartOutlined />}
                </ActionIcon>
              </Group>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Ribbon>
  );
}
