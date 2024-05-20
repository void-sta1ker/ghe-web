import { createContext, useContext } from "react";
import settings from "@/config/settings";
import type { AppLang } from "@/types";
import safeLocalStorage from "@/helpers/safe-local-storage";

interface LangContext {
  lang: AppLang;
  changeLang: (lang: AppLang) => void;
}

const langContext = createContext<LangContext>({
  lang: (safeLocalStorage.getItem("i18nextLng") ??
    settings.defaultLanguage) as AppLang,
  changeLang: () => {
    //
  },
});

langContext.displayName = "langContext";

const LangContextConsumer = langContext.Consumer;

// eslint-disable-next-line @typescript-eslint/no-use-before-define
export { LangContextConsumer as LangConsumer, langContext, useLangContext };

function useLangContext(): React.ContextType<React.Context<LangContext>> {
  return useContext(langContext);
}
