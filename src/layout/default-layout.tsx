import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ActionIcon,
  AppShell,
  Burger,
  Container,
  Group,
  Image,
  Indicator,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import useAuthStore from "@/hooks/use-auth-store";
import UserProfile from "@/components/user-profile";
import SearchInput from "@/components/search-input";
import AuthForm from "@/components/auth-form";
import CatalogDrawer from "@/components/catalog-drawer";
import Footer from "@/components/footer";
import CatalogMenu from "@/components/catalog-menu";
import LangChanger from "@/components/lang-changer";
import { useQuery } from "@tanstack/react-query";
import { getCart, getWishlist } from "@/services";

export default function DefaultLayout(props: { children: React.ReactElement }) {
  const { children } = props;

  const router = useRouter();

  const pinned = useHeadroom({ fixedAt: 120 });

  const [mobileOpened, { toggle: toggleMobile, close: closeDrawer }] =
    useDisclosure();

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

  const likedItemsCount = wishlist.data?.length ?? 0;

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    placeholderData: { products: [], user: "" },
    enabled: isAuth,
  });

  const cartItemsCount = cart.data?.products.length ?? 0;

  return (
    <AppShell
      header={{ height: 60, collapsed: !pinned }} // offset: false
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !mobileOpened },
      }}
      footer={{ height: 300, collapsed: true }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="lg" h="100%" px="32px">
          <Group h="100%">
            <UnstyledButton
              h="100%"
              onClick={() => {
                router.push("/");
              }}
            >
              <Image
                radius="md"
                // src={brandLogo}
                src="/greenhaven-transparent.png"
                alt="brand logo"
                h="100%"
                // component={NextImage}
                // priority
              />
            </UnstyledButton>

            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />

            <CatalogDrawer />

            <SearchInput />

            <ActionIcon
              visibleFrom="sm"
              variant="transparent"
              c="gray"
              // className="text-gray-500 hover:text-green-500 transition"
              onClick={() => {
                if (isAuth) {
                  router.push("/cart");
                  return;
                }

                document.getElementById("login")?.click();
              }}
            >
              <Indicator
                inline
                disabled={cartItemsCount === 0}
                color="red"
                size={15}
                label={cartItemsCount}
              >
                <ShoppingCartOutlined style={{ fontSize: "24px" }} />
              </Indicator>
            </ActionIcon>

            <ActionIcon
              visibleFrom="sm"
              variant="transparent"
              c="gray"
              // className="text-gray-500 hover:text-green-500 transition"
              onClick={() => {
                if (isAuth) {
                  router.push("/wishlist");
                  return;
                }

                document.getElementById("login")?.click();
              }}
            >
              <Indicator
                inline
                disabled={likedItemsCount === 0}
                color="red"
                size={15}
                label={likedItemsCount}
              >
                <HeartOutlined style={{ fontSize: "24px" }} />
              </Indicator>
            </ActionIcon>

            {isAuth ? (
              <UserProfile
                onClick={() => {
                  router.push("/profile");
                }}
              />
            ) : (
              <AuthForm />
            )}

            <LangChanger />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <CatalogMenu closeDrawer={closeDrawer} />
      </AppShell.Navbar>

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        <Container size="lg">{children}</Container>
      </AppShell.Main>

      {/* AppShell.Footer */}
      <Footer />
    </AppShell>
  );
}
