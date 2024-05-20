import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  NumberFormatter,
  Paper,
  Rating,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Result } from "antd";
import { SlNote } from "react-icons/sl";
import useAuthStore from "@/hooks/use-auth-store";
import queryClient from "@/utils/query-client";
import {
  deleteAddress,
  getAddresses,
  getPurchases,
  getReviews,
  postReview,
  updateAddress,
} from "@/services";
import UserProfile from "@/components/user-profile";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { FaPlus, FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoIosRadioButtonOn, IoIosRadioButtonOff } from "react-icons/io";
import Head from "next/head";
import { IoLogOutOutline } from "react-icons/io5";
import AddAddressModal from "@/components/add-address-modal";
import { MdDelete } from "react-icons/md";
import type { AxiosResponse } from "axios";
import { regions } from "@/config/constants";

export default function Profile() {
  const router = useRouter();

  const { isAuth, setIsAuth } = useAuthStore();

  const [opened, { open, close }] = useDisclosure();
  const [
    addressModalOpened,
    { open: openAddressModal, close: closeAddressModal },
  ] = useDisclosure();

  const [productId, setProductId] = useState<string>();

  const [addressIdx, setAddressIdx] = useState<number>();

  const form = useForm({
    initialValues: {
      title: "",
      rating: 0,
      review: "",
      isRecommended: true,
    },
    validate: {
      title: (value) => (value.trim() === "" ? "Title is required" : null),
      review: (value) => (value.trim() === "" ? "Review is required" : null),
    },
  });

  const purchase = useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const res = await getPurchases();
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
  });

  console.log(purchase.data);

  const review = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await getReviews();
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
  });

  console.log(review.data);

  const address = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await getAddresses();
      return res;
    },
    select(data) {
      return data.results;
    },
    placeholderData: { results: [], count: 0 },
  });

  console.log(address.data);

  const reviewMutation = useMutation({
    mutationFn: postReview,
    onSuccess(data, variables, context) {
      console.log(data);

      close();

      void queryClient.invalidateQueries({ queryKey: ["reviews"] });

      notifications.show({
        title: "Success!",
        message: "Thank you for your review!",
        color: "green",
      });
    },
  });

  const addressDelMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess(data, variables, context) {
      console.log(data);

      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError(res: AxiosResponse, variables, context) {
      console.error(res);

      notifications.show({
        title: "Error",
        message: res.data.message,
        color: "red",
      });
    },
  });

  const addressUpdateMutation = useMutation({
    mutationFn: async (payload: { id: string; isDefault: boolean }) => {
      const { id, isDefault } = payload;
      const res = await updateAddress(id, { isDefault });
      return res;
    },
    onSuccess(data, variables, context) {
      console.log(data);

      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onSettled(data, error, variables, context) {
      setAddressIdx(undefined);
    },
  });

  const onSubmit = form.onSubmit((values) => {
    reviewMutation.mutate({ product: productId as string, ...values });
  });

  useEffect(() => {
    // bug, redirecting to / even if user is authenticated
    // if (!isAuth) {
    //   router.replace("/");
    // }
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <Stack gap="lg">
        <Group justify="space-between">
          <UserProfile />

          <Button
            variant="transparent"
            c="gray"
            p="0"
            leftSection={<IoLogOutOutline size={20} />}
            onClick={() => {
              localStorage.clear();
              queryClient.clear();
              setIsAuth(false);
              router.push("/");
            }}
          >
            Logout
          </Button>
        </Group>

        <Tabs defaultValue="purchases">
          <Tabs.List>
            <Tabs.Tab value="purchases">Purchases</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
            <Tabs.Tab value="addresses">Addresses</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="purchases">
            {(purchase.data?.length === 0 || !purchase.data) && (
              <Result
                status="404"
                title="Your purchased items will appear here."
                subTitle="Look through the catalog to find products, or use the search."
                extra={
                  <Button
                    variant="default"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Go to catalog
                  </Button>
                }
              />
            )}

            {purchase.data &&
              purchase.data?.length > 0 &&
              purchase.data.map((item) => (
                <Stack
                  key={item.created}
                  component={Paper}
                  bg="#f4f6f7"
                  p="md"
                  mt="md"
                >
                  <Text size="14px" fw={500}>
                    Order id:{" "}
                    <UnstyledButton
                      c="blue"
                      styles={{ root: { fontSize: "14px" } }}
                      fw={400}
                    >
                      {item.id}
                    </UnstyledButton>
                  </Text>

                  <Group>
                    {item.products.map((product) => (
                      <Group
                        key={product.product.id}
                        justify="space-between"
                        flex={1}
                      >
                        <Text size="14px">
                          {product.quantity} x {product.product.name}
                        </Text>

                        <Text size="14px">
                          {product.status}{" "}
                          {product.status === "DELIVERED" &&
                            review.data?.findIndex(
                              (r) => r.product.id === product.product.id,
                            ) === -1 && (
                              <Button
                                variant="white"
                                onClick={() => {
                                  setProductId(product.product.id);
                                  open();
                                }}
                              >
                                Leave a review
                              </Button>
                            )}
                        </Text>

                        <Text size="14px">{product.totalPrice} som</Text>
                      </Group>
                    ))}
                  </Group>

                  <Text size="14px" fw={500} className="self-end">
                    Total:{" "}
                    <NumberFormatter
                      value={item.total}
                      suffix=" som"
                      thousandSeparator=" "
                    />{" "}
                  </Text>
                </Stack>
              ))}
          </Tabs.Panel>

          <Tabs.Panel value="reviews">
            {review.data?.length === 0 && (
              <Center h="400px">
                <Stack justify="center" align="center">
                  <Center bg="#e3e8ea" p="sm" className="rounded-full">
                    <SlNote fontSize={24} color="#a5b1bb" />
                  </Center>
                  <Text fw={500}>You don't have any reviews yet</Text>
                </Stack>
              </Center>
            )}

            {review.data && review.data?.length > 0 && (
              <Paper bg="#f4f6f7" p="md" mt="md">
                <SimpleGrid cols={6}>
                  <Text size="14px" fw={500}>
                    Product
                  </Text>
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

                {review.data &&
                  review.data?.length > 0 &&
                  review.data.map((item) => (
                    <SimpleGrid key={item.product.id} cols={6} mt="md">
                      <UnstyledButton
                        c="blue"
                        onClick={() => {
                          router.push(`/products/${item.product.id}`);
                        }}
                      >
                        <Text size="14px">{item.product.name}</Text>
                      </UnstyledButton>

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

          <Tabs.Panel value="addresses">
            {(address.data?.length === 0 || !address.data) && (
              <Center h="400px">
                <Stack justify="center" align="center">
                  <Center bg="#e3e8ea" p="sm" className="rounded-full">
                    <SlNote fontSize={24} color="#a5b1bb" />
                  </Center>

                  <Text fw={500}>You don't have any addresses yet</Text>

                  <Button
                    variant="outline"
                    leftSection={<FaPlus />}
                    onClick={openAddressModal}
                  >
                    Add
                  </Button>
                </Stack>
              </Center>
            )}

            <Box pos="relative">
              <LoadingOverlay
                visible={address.isLoading || address.isFetching}
              />

              <Stack>
                <Paper bg="#f4f6f7" p="md" mt="md">
                  <SimpleGrid cols={7}>
                    <Text size="14px" fw={500} className="col-span-2">
                      Address
                    </Text>
                    <Text size="14px" fw={500}>
                      City
                    </Text>
                    <Text size="14px" fw={500}>
                      State
                    </Text>
                    <Text size="14px" fw={500}>
                      Zip code
                    </Text>
                    <Text size="14px" fw={500}>
                      Default
                    </Text>
                    <Text size="14px" fw={500}>
                      Actions
                    </Text>
                  </SimpleGrid>

                  <Divider my="xs" />

                  {address.data &&
                    address.data?.length > 0 &&
                    address.data.map((item, index) => (
                      <SimpleGrid key={item.id} cols={7} mt="md">
                        <Text size="14px" className="col-span-2">
                          {item.address}
                        </Text>

                        <Text size="14px">{item.city}</Text>

                        <Text size="14px">
                          {regions.find((r) => r.value === item.state)?.label}
                        </Text>

                        <Text size="14px">{item.zipCode}</Text>

                        <Text size="16px">
                          {item.isDefault ? (
                            <ActionIcon variant="transparent" color="dark">
                              <IoIosRadioButtonOn />
                            </ActionIcon>
                          ) : (
                            <ActionIcon
                              variant="transparent"
                              color="dark"
                              loading={
                                addressUpdateMutation.isPending &&
                                addressIdx === index
                              }
                              onClick={() => {
                                setAddressIdx(index);
                                addressUpdateMutation.mutate({
                                  id: item.id,
                                  isDefault: true,
                                });
                              }}
                            >
                              <IoIosRadioButtonOff />
                            </ActionIcon>
                          )}
                        </Text>

                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => {
                            addressDelMutation.mutate(item.id);
                          }}
                        >
                          <MdDelete />
                        </ActionIcon>
                      </SimpleGrid>
                    ))}
                </Paper>

                <Button
                  variant="outline"
                  className="self-end"
                  leftSection={<FaPlus />}
                  onClick={openAddressModal}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Tabs.Panel>
        </Tabs>

        <Modal title="Leave a review" opened={opened} onClose={close} centered>
          <form onSubmit={onSubmit}>
            <Stack>
              <TextInput placeholder="Title" {...form.getInputProps("title")} />
              <Textarea
                placeholder="Review"
                rows={5}
                minRows={5}
                maxRows={10}
                {...form.getInputProps("review")}
              />

              <Rating
                value={form.values.rating}
                onChange={(value) => form.setFieldValue("rating", value)}
              />

              <Switch
                label="Do you recommend?"
                {...form.getInputProps("isRecommended", { type: "checkbox" })}
              />

              <Button
                type="submit"
                variant="light"
                className="self-end"
                loading={reviewMutation.isPending}
              >
                Submit
              </Button>
            </Stack>
          </form>
        </Modal>

        <AddAddressModal
          opened={addressModalOpened}
          onClose={closeAddressModal}
        />
      </Stack>
    </>
  );
}
