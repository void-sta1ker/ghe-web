import { useRef } from "react";
import NextImage from "next/image";
import { Poppins } from "next/font/google";
import { Flex, Group, Image, Skeleton, Stack, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "@/components/product-card";
import { getProductsList } from "@/services";
import Head from "next/head";

// const poppins = Poppins({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
// });

export default function Home() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const newProducts = useQuery({
    queryKey: ["new-products"],
    queryFn: async () => {
      const res = await getProductsList({ isNew: true });
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0, category: null },
  });

  const discountedProducts = useQuery({
    queryKey: ["discounted-products"],
    queryFn: async () => {
      const res = await getProductsList({ inDiscount: true });
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0, category: null },
  });

  const generalProducts = useQuery({
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

  return (
    // className={`${poppins.className}`}
    <>
      <Head>
        <title>Green Haven Express</title>
      </Head>

      <Stack component="main" gap="48px">
        <Carousel
          withIndicators
          loop
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          <Carousel.Slide>
            <Flex>
              <Image src="/avocado.jpg" alt="carousel item" w="50%" />
              <Image src="/avocado-2.jpg" alt="carousel item" w="50%" />
            </Flex>
          </Carousel.Slide>
          <Carousel.Slide>
            <Flex wrap="nowrap">
              <Image src="/jar.jpg" alt="carousel item" w="50%" />
              <Image src="/jar-2.jpg" alt="carousel item" w="50%" />
            </Flex>
          </Carousel.Slide>
          <Carousel.Slide>
            <Flex>
              <Image src="/bath-essentials-2.jpg" alt="carousel item" w="50%" />
              <Image src="/bath-essentials.jpg" alt="carousel item" w="50%" />
            </Flex>
          </Carousel.Slide>
          <Carousel.Slide>
            <Flex>
              <Image src="/bag-hard.jpg" alt="carousel item" w="50%" />
              <Image src="/bag-hard-2.jpg" alt="carousel item" w="50%" />
            </Flex>
          </Carousel.Slide>
        </Carousel>

        <Stack>
          <Title order={2} fw={400}>
            Fresh arrivals
          </Title>

          <Skeleton visible={newProducts.isLoading}>
            <Group gap="sm">
              {newProducts.data?.map((product) => (
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

        <Stack>
          <Title order={2} fw={400}>
            Discounted
          </Title>

          <Skeleton visible={discountedProducts.isLoading}>
            <Group gap="sm">
              {discountedProducts.data?.map((product) => (
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

        <Stack>
          <Title order={2} fw={400}>
            You might be interested in
          </Title>

          <Skeleton visible={generalProducts.isLoading}>
            <Group gap="sm">
              {generalProducts.data?.map((product) => (
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
