import { useEffect, useRef, useState } from "react";
import { PatternFormat } from "react-number-format";
import {
  Button,
  Group,
  Modal,
  PasswordInput,
  PinInput,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useCountdown } from "usehooks-ts";
import type { AxiosResponse } from "axios";
import useAuthStore from "@/hooks/use-auth-store";
import { checkPhone, login } from "@/services";
import classes from "@/styles/styles.module.css";
import type { User } from "@/types";
import dayjs from "dayjs";

interface Props {
  setMode: (mode: "login" | "register") => void;
  openModal: () => void;
  closeModal: () => void;
  modalOpened: boolean;
}

export default function LoginForm(props: Props) {
  const { setMode, closeModal, modalOpened } = props;

  const [step, setStep] = useState<1 | 2>(1);

  const [token, setToken] = useState("");

  const [user, setUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "",
  });

  const { setIsAuth } = useAuthStore();

  const pinInputRef = useRef<HTMLInputElement>(null);

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      // embla?.scrollNext();
      setToken(res.token);
      setUser(res.user);
      setStep(2);
    },
    onError: (res: AxiosResponse) => {
      console.error(res);

      notifications.show({
        title: "Error",
        message: res.data?.message,
        color: "red",
      });
    },
  });

  const checkPhoneMutation = useMutation({
    mutationFn: checkPhone,
    onSuccess: (res) => {
      const { success } = res;

      if (success) {
        localStorage.setItem("access_token", token);
        // localStorage.setItem("refresh_token", res.refresh_token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, id: undefined }),
        );

        setIsAuth(true);

        onModalClose();

        notifications.show({
          title: "Success",
          message: "Login successful!",
          color: "green",
        });
      }
    },
    onError: (res: AxiosResponse) => {
      console.error(res);

      notifications.show({
        title: "Error",
        message: res.data?.message,
        color: "red",
      });
    },
  });

  const form = useForm({
    initialValues: {
      phoneNumber: "",
      password: "",
      otp: "",
    },
    validate: (values) => {
      if (step === 1) {
        return {
          phoneNumber:
            values.phoneNumber.trim() === ""
              ? "This field cannot be empty"
              : null,
          password:
            values.password.trim() === "" ? "This field cannot be empty" : null,
        };
      }

      if (step === 2) {
        return {
          otp: values.otp.trim() === "" ? "This field cannot be empty" : null,
        };
      }

      return {};
    },
  });

  const nextStep = () => {
    if (step === 1 && !form.validate().hasErrors) {
      loginMutation.mutate({
        ...form.values,
        phoneNumber: form.values.phoneNumber.replace(/\D/g, ""),
      });
    }

    if (step === 2 && !form.validate().hasErrors) {
      checkPhoneMutation.mutate({
        token,
        phoneNumber: user.phoneNumber.replace(/\D/g, ""),
        otp: form.values.otp,
      });
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onModalClose = () => {
    closeModal();

    form.reset();

    setToken("");

    setUser({
      id: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "",
    });
  };

  const onResend = (): void => {
    loginMutation.mutate({
      ...form.values,
      phoneNumber: form.values.phoneNumber.replace(/\D/g, ""),
    });

    resetCountdown();
    startCountdown();

    setTimeout(() => {
      pinInputRef.current?.focus();
    }, 500);
  };

  useEffect(() => {
    if (step === 2) {
      startCountdown();

      setTimeout(() => {
        pinInputRef.current?.focus();
      }, 500);
    }
  }, [step]);

  return (
    <Modal
      opened={modalOpened}
      onClose={onModalClose}
      title={step === 1 ? "Login" : "Enter SMS code"}
      centered
    >
      {step === 2 && (
        <Text c="gray" size="sm" mb="lg">
          Code has been sent to phone: {form.values.phoneNumber}
        </Text>
      )}

      <Stack gap="xs">
        {step === 1 ? (
          <>
            <PatternFormat
              customInput={TextInput}
              format="+998 ## ### ## ##"
              mask="_"
              label="Phone number"
              placeholder="+998"
              {...form.getInputProps("phoneNumber")}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter password"
              {...form.getInputProps("password")}
            />

            <Text c="dimmed" size="12px">
              Don’t have an account?{" "}
              <UnstyledButton
                className={classes.link}
                onClick={() => {
                  setMode("register");
                }}
              >
                Register
              </UnstyledButton>
            </Text>
          </>
        ) : (
          <>
            <PinInput
              ref={pinInputRef}
              length={6}
              placeholder="0"
              type="number"
              oneTimeCode
              mask
              {...form.getInputProps("otp")}
            />

            <Group align="baseline" justify="space-between">
              <Group gap="4px" align="baseline">
                <Text size="14px" fw={500} c="dimmed">
                  Resend code in
                </Text>

                <Text c="blue">
                  {dayjs().startOf("day").second(count).format("mm:ss")}
                </Text>
              </Group>

              {count === 0 && (
                <UnstyledButton
                  c="blue"
                  className="hover:underline"
                  onClick={onResend}
                >
                  Resend
                </UnstyledButton>
              )}
            </Group>
          </>
        )}

        <Group>
          <Button
            variant="default"
            flex="1"
            onClick={step === 1 ? onModalClose : prevStep}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            flex="1"
            onClick={nextStep}
            loading={loginMutation.isPending || checkPhoneMutation.isPending}
          >
            Next
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
