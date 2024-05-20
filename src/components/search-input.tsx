import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  useClickOutside,
  useDebouncedValue,
  useInputState,
} from "@mantine/hooks";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { searchProducts } from "@/services";
import LazyImage from "./lazy-image";

export default function SearchInput() {
  const router = useRouter();

  const [search, setSearch] = useInputState("");

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const [popoverOpened, setPopoverOpened] = useState(false);

  const ref = useClickOutside(() => {
    setPopoverOpened(false);
  });

  const products = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      const res = await searchProducts(debouncedSearch);
      return res;
    },
    select(data) {
      return data.results;
    },
    enabled: Boolean(debouncedSearch.trim()),
  });

  console.log(products.data);

  const productData = (products.data ?? []).slice(0, 5);

  useEffect(() => {
    setPopoverOpened(Boolean(debouncedSearch.trim()));
  }, [debouncedSearch]);

  return (
    <Popover
      width="target"
      position="bottom"
      shadow="md"
      opened={popoverOpened}
    >
      <Popover.Target>
        <Flex align="stretch" flex="1" className="rounded">
          <TextInput
            ref={ref}
            value={search}
            onChange={setSearch}
            flex="1"
            placeholder="Search products..."
            radius="0"
            onFocus={() => {
              if (!popoverOpened && productData.length > 0) {
                setPopoverOpened(true);
              }
            }}
            onClick={() => {
              if (!popoverOpened && productData.length > 0) {
                setPopoverOpened(true);
              }
            }}
            style={{
              borderTopLeftRadius: "4px",
              borderBottomLeftRadius: "4px",
            }}
            classNames={{
              input: "rounded-l",
            }}
            rightSection={
              debouncedSearch && (
                <ActionIcon
                  variant="transparent"
                  c="gray.5"
                  onClick={() => {
                    setSearch("");
                    setPopoverOpened(false);
                  }}
                >
                  <CloseOutlined />
                </ActionIcon>
              )
            }
          />

          <ActionIcon
            size="36px"
            radius="0"
            style={{
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          >
            <SearchOutlined />
          </ActionIcon>
        </Flex>
      </Popover.Target>

      <Popover.Dropdown ref={ref}>
        <Stack
          gap={0}
          align={productData?.length === 0 ? "center" : undefined}
          pos="relative"
          mih={200}
        >
          <LoadingOverlay
            visible={products.isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          {productData?.map((p) => (
            <Group
              key={p.id}
              className="hover:bg-[#f8f9fa] cursor-pointer p-3 transition rounded"
              onClick={() => {
                setSearch("");
                setPopoverOpened(false);
                router.push(`/products/${p.id}`);
              }}
            >
              <Box w={32} h={32}>
                <LazyImage
                  src={p?.images?.[0]?.imageUrl}
                  fit="contain"
                  alt="search result"
                  h={32}
                />
              </Box>

              <Text flex={1}>{p.name}</Text>
            </Group>
          ))}

          {productData.length === 0 && search !== "" && (
            <Text c="dimmed">Not found</Text>
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
