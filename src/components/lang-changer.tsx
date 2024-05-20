import { useEffect, useState } from "react";
import { Image, Menu, UnstyledButton } from "@mantine/core";
import { useLangContext } from "@/contexts";
import { valueof } from "@/types";

const langMap = {
  en: "/united-kingdom.png",
  ru: "/russia.png",
  uz: "/uzbekistan.png",
} as const;

type Url = valueof<typeof langMap>;

export default function LangChanger(): React.ReactElement {
  const { lang, changeLang } = useLangContext();

  const [url, setUrl] = useState<Url>("/united-kingdom.png");

  useEffect(() => {
    setUrl(langMap[lang] as Url);
  }, [lang]);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton variant="transparent" w="32px" h="32px">
          <Image src={url} alt="lang" />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={
            <Image src="/united-kingdom.png" alt="lang" w="32px" h="32px" />
          }
          onClick={() => {
            changeLang("en");
          }}
        >
          English
        </Menu.Item>
        <Menu.Item
          leftSection={<Image src="/russia.png" alt="lang" w="32px" h="32px" />}
          onClick={() => {
            changeLang("ru");
          }}
        >
          Русский
        </Menu.Item>
        <Menu.Item
          leftSection={
            <Image src="/uzbekistan.png" alt="lang" w="32px" h="32px" />
          }
          onClick={() => {
            changeLang("uz");
          }}
        >
          O&apos;zbekcha
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
