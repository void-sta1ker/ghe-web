import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { langContext } from "@/contexts/lang-context";
import "@/utils/i18n";
import type { AppLang } from "@/types";

interface Props {
  children: React.ReactElement;
}

export default function LangProvider(props: Props): React.ReactElement {
  const { children } = props;

  const { i18n } = useTranslation();

  const [lang, setLang] = useState<AppLang>(i18n.language as AppLang);

  const value = useMemo(
    () => ({
      lang,
      changeLang: (lng: AppLang) => {
        void i18n.changeLanguage(lng);
        setLang(lng);
      },
    }),
    [i18n, lang],
  );

  return <langContext.Provider value={value}>{children}</langContext.Provider>;
}
