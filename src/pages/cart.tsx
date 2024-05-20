import { useState } from "react";
import { useRouter } from "next/router";
import { Result } from "antd";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isObject } from "radash";
import formatAmount from "@/helpers/format-amount";
import CartItem from "@/components/cart-item";
import { DeleteOutlined } from "@ant-design/icons";
import { getCart, removeFromCart, makeOrder } from "@/services";
import queryClient from "@/utils/query-client";
import { notifications } from "@mantine/notifications";
import Head from "next/head";

export default function Cart() {
  const router = useRouter();

  const [selectAll, setSelectAll] = useState(false);

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
  });

  const cartMutation = useMutation({
    mutationFn: async (payload: { cartId: string; productId: string }) => {
      const { cartId, productId } = payload;
      const res = await removeFromCart(cartId, productId);
      return res;
    },
    onSuccess(data, variables, context) {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });

      notifications.show({
        title: "Success",
        message: "Product removed from cart",
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (payload: { cartId: string; total: number }) => {
      const { cartId, total } = payload;
      const res = await makeOrder(cartId, total);
      return res;
    },
    onSuccess(data, variables, context) {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });

      localStorage.removeItem("cartId");

      notifications.show({
        title: "Success",
        message: "Order placed successfully",
      });
    },
  });

  const onMakeOrder = () => {
    // if (cart.data && cart.data.length > 0) {
    //   router.push("/checkout");
    // }

    const cartId = localStorage.getItem("cartId") ?? "";

    const total =
      cart.data?.reduce((total, currProduct) => {
        if (currProduct.product.isDiscounted) {
          return total + currProduct.product.discountedPrice;
        }
        return total + currProduct.product.price;
      }, 0) ?? 0;

    if (cartId) {
      orderMutation.mutate({ cartId, total });
    }
  };

  if (
    cart.data === null ||
    cart.data === undefined ||
    (cart.data && cart.data.length === 0)
  ) {
    return (
      <>
        <Head>
          <title>Cart | GreenHaven Express</title>
        </Head>

        <Result
          status="warning"
          title="Currently, there is nothing in your cart"
          extra={
            <Button
              variant="outline"
              onClick={() => {
                router.push("/");
              }}
            >
              View products
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Cart | GreenHaven Express</title>
      </Head>

      <Flex gap="32px" align="start">
        <Stack flex={1} gap={0}>
          <Flex justify="space-between" align="baseline">
            <Group align="baseline">
              <Title fw={500}>Cart</Title>
              <Text size="sm" c="gray">
                {cart.data?.length} item(s)
              </Text>
            </Group>

            <Group>
              {selectAll && (
                <Button
                  variant="transparent"
                  color="red"
                  p="0"
                  leftSection={<DeleteOutlined />}
                  loading={cartMutation.isPending}
                  onClick={() => {
                    cart.data?.forEach((item) => {
                      // remove(product.id);
                      const cartId = localStorage.getItem("cartId") ?? "";

                      if (cartId) {
                        cartMutation.mutate({
                          cartId,
                          productId: item.product.id,
                        });
                      }
                    });
                  }}
                >
                  Remove selected
                </Button>
              )}

              <Divider orientation="vertical" mx="sm" />

              <Checkbox
                label="Select all"
                labelPosition="left"
                onChange={(e) => {
                  setSelectAll(e.target.checked);
                }}
              />
            </Group>
          </Flex>

          <Divider my="sm" />

          <Skeleton visible={cart.isLoading}>
            <Stack>
              {cart.data?.map(({ quantity, product }) => (
                <CartItem
                  key={product.id}
                  id={product.id}
                  images={product.images}
                  name={product.name}
                  price={
                    product.isDiscounted
                      ? product.discountedPrice
                      : product.price
                  }
                  merchant={product.merchant}
                  brand={product.brand.name}
                  quantity={quantity}
                  totalQuantity={product.quantity}
                  selectAll={selectAll}
                  setSelectAll={setSelectAll}
                />
              ))}
            </Stack>
          </Skeleton>
        </Stack>

        <Paper p="lg" bg="#f4f6f7" w={300} mt="56px">
          <Group align="baseline" mb="md">
            <Title order={3} fw={500} flex={1}>
              Total
            </Title>
            <Text fw={500} flex={1}>
              {formatAmount(
                cart.data?.reduce((total, currProduct) => {
                  if (currProduct.product.isDiscounted) {
                    return total + currProduct.product.discountedPrice;
                  }
                  return total + currProduct.product.price;
                }, 0) ?? 0,
              )}{" "}
              som
            </Text>
          </Group>

          <Group>
            <Text c="gray" flex={1} size="sm">
              Product count
            </Text>
            <Text flex={1} size="sm">
              {cart.data?.length ?? 0} pcs.
            </Text>
          </Group>

          <Group>
            <Text c="gray" flex={1} size="sm">
              Shipping
            </Text>
            <Text c="green" flex={1} size="sm">
              Free
            </Text>
          </Group>

          <Divider my="md" />

          <Text c="green" size="xs" fw={500}>
            Free shipping
          </Text>
          <Text c="gray" size="xs" className="tracking-wide">
            Delivery time: in Tashkent within 24 hours, throughout the Republic
            within 3 days.
          </Text>

          <Button w="100%" mt="md" onClick={onMakeOrder}>
            Pay online
          </Button>
        </Paper>
      </Flex>
    </>
  );
}
