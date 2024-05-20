import { Burger, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CatalogMenu from "./catalog-menu";

export default function CatalogDrawer() {
  const [
    drawerOpened,
    { open: openDrawer, close: closeDrawer, toggle: toggleDrawer },
  ] = useDisclosure(false);

  return (
    <>
      <Button
        component="span"
        visibleFrom="sm"
        onClick={toggleDrawer}
        rightSection={
          <Burger
            opened={drawerOpened}
            size="sm"
            color="white"
            aria-label="Toggle navbar"
          />
        }
      >
        Catalog
      </Button>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
        closeOnEscape
        closeOnClickOutside
        // removeScrollProps={{ enabled: false }}
      >
        <CatalogMenu closeDrawer={closeDrawer} />
      </Drawer>
    </>
  );
}
