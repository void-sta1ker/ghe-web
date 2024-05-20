import { useRouter } from "next/router";
import { Result } from "antd";
import { Box, Button, Divider, Group, Skeleton, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { CloseCircleOutlined } from "@ant-design/icons";
import { clearWishlist, getProductsList, getWishlist } from "@/services";
import { notifications } from "@mantine/notifications";
import queryClient from "@/utils/query-client";
import Head from "next/head";

export default function WishList() {
  const router = useRouter();

  const wishlist = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    select(data) {
      return data.results.filter((item) => item && item.isLiked);
    },
    placeholderData: { results: [], count: 0 },
  });

  console.log(wishlist.data);

  const wishlistMutation = useMutation({
    mutationFn: clearWishlist,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });

      notifications.show({
        title: "Success",
        message: "Your wishlist has been cleared",
      });
    },
  });

  const onClearAll = () => {
    wishlistMutation.mutate();
  };

  if (wishlist.data?.length === 0 || !wishlist.data) {
    return (
      <>
        <Head>
          <title>Wishlist</title>
        </Head>

        <Result
          status="warning"
          title="Your wishlist is empty"
          subTitle="Add your favorite products to wishlist to view or purchase later"
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
        <title>Wishlist</title>
      </Head>

      <Box my="48px">
        <Group justify="space-between">
          <Title order={2} fw={400}>
            Favorites
          </Title>

          <Button
            variant="transparent"
            c="gray"
            rightSection={<CloseCircleOutlined />}
            onClick={onClearAll}
            loading={wishlistMutation.isPending}
          >
            Clear all
          </Button>
        </Group>

        <Divider my="xs" mb="lg" />

        <Skeleton visible={wishlist.isLoading}>
          <Group gap="sm">
            {wishlist.data?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                images={product.images}
                averageRating={product.averageRating}
                isDiscounted={product.isDiscounted}
                discountedPrice={product.discountedPrice}
                quantity={product.quantity}
                totalReviews={product.totalReviews}
              />
            ))}
          </Group>
        </Skeleton>
      </Box>
    </>
  );
}
