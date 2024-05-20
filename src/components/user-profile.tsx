import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";
import { Avatar, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import safeLocalStorage from "@/helpers/safe-local-storage";
import { User } from "@/types";

interface Props {
  onClick?: () => void;
}

export default function UserProfile(props: Props) {
  const { onClick } = props;

  const isClickable = typeof onClick === "function";

  const isMobile = useMediaQuery("(max-width: 767px)") ?? false;

  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const user = JSON.parse(safeLocalStorage.getItem("user") ?? "{}");

    setUser(user);
  }, []);

  if (isMobile) {
    return <Avatar onClick={onClick} />;
  }

  return (
    <Group
      gap="6px"
      className={isClickable ? "cursor-pointer" : ""}
      onClick={onClick}
    >
      <Avatar color="green" />

      <Stack gap={0}>
        <Text size="xs" fw={500}>
          {user.firstName} {user.lastName}
        </Text>

        <PatternFormat
          format="+### ## ### ## ##"
          value={user.phoneNumber}
          displayType="text"
          renderText={(value) => (
            <Text size="xs" c="gray">
              {value}
            </Text>
          )}
        />
      </Stack>
    </Group>
  );
}
