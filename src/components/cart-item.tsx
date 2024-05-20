import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { ProductWithFeedback } from "@/types";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeQuantity, removeFromCart } from "@/services";
import queryClient from "@/utils/query-client";
import { notifications } from "@mantine/notifications";

interface Props
  extends Pick<ProductWithFeedback, "id" | "images" | "name" | "price"> {
  quantity: number;
  merchant: string;
  brand: string;
  totalQuantity: number;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CartItem(props: Props) {
  const {
    id,
    images,
    name,
    price,
    quantity,
    merchant,
    brand,
    totalQuantity,
    selectAll,
    setSelectAll,
  } = props;

  const productCount = quantity;

  const [checked, setChecked] = useState(false);

  const removeMutation = useMutation({
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

  const quantityMutation = useMutation({
    mutationFn: async (payload: {
      cartId: string;
      product: string;
      action: "inc" | "dec";
    }) => {
      const { cartId, product, action } = payload;
      const res = await changeQuantity(cartId, product, action);
      return res;
    },
    onSuccess(data, variables, context) {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const onRemove = () => {
    const cartId = localStorage.getItem("cartId") ?? "";

    if (cartId) {
      removeMutation.mutate({ cartId, productId: id });
    }
  };

  const onInc = () => {
    const cartId = localStorage.getItem("cartId") ?? "";

    if (cartId) {
      quantityMutation.mutate({
        cartId,
        product: id,
        action: "inc",
      });
    }
  };

  const onDec = () => {
    const cartId = localStorage.getItem("cartId") ?? "";

    if (cartId) {
      quantityMutation.mutate({
        cartId,
        product: id,
        action: "dec",
      });
    }
  };

  useEffect(() => {
    setChecked(selectAll);
  }, [selectAll]);

  return (
    <Flex align="start" gap="lg">
      <Image src={`${images[0]?.imageUrl}`} alt="cart item" w="72px" />

      <Stack flex={1}>
        <Group justify="space-between">
          <Text size="18px">{name}</Text>
          <Checkbox
            checked={checked}
            onChange={(e) => {
              const newVal = e.target.checked;
              setChecked(newVal);

              // if (selectAll && !newVal) {
              //   setSelectAll(false);
              // }
            }}
          />
        </Group>

        <Group>
          <Text c="gray">Price:</Text>
          <Text>{price}</Text>
        </Group>

        <Group>
          <Text c="gray">Brand:</Text>
          <Text>{brand}</Text>
        </Group>

        <Group justify="space-between">
          <Group p="4px" bg="#f4f6f7" className="rounded">
            <ActionIcon
              variant="transparent"
              c="dark"
              disabled={productCount === 1}
              loading={quantityMutation.isPending}
              onClick={onDec}
            >
              <MinusOutlined />
            </ActionIcon>

            {productCount}

            <ActionIcon
              variant="transparent"
              c="dark"
              // if out of stock
              disabled={productCount >= totalQuantity}
              loading={quantityMutation.isPending}
              onClick={onInc}
            >
              <PlusOutlined />
            </ActionIcon>
          </Group>

          <Button
            variant="transparent"
            c="red"
            p="0"
            leftSection={<DeleteOutlined />}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Group>

        <Divider my="sm" />
      </Stack>
    </Flex>
  );
}
