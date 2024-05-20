import { useState } from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  return (
    <>
      <Button id="login" visibleFrom="sm" variant="outline" onClick={openModal}>
        Login
      </Button>

      {mode === "login" && (
        <LoginForm
          setMode={setMode}
          openModal={openModal}
          closeModal={closeModal}
          modalOpened={modalOpened}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          setMode={setMode}
          openModal={openModal}
          closeModal={closeModal}
          modalOpened={modalOpened}
        />
      )}
    </>
  );
}
