import { regions } from "@/config/constants";
import { createAddress } from "@/services";
import queryClient from "@/utils/query-client";
import {
  Button,
  Modal,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";

interface Props {
  opened: boolean;
  onClose: () => void;
}

export default function AddAddressModal(props: Props) {
  const { opened, onClose } = props;

  const form = useForm({
    initialValues: {
      address: "",
      city: "",
      state: "",
      country: "uzbekistan",
      zipCode: "",
      isDefault: true,
    },
    validate: {
      address: (value) =>
        value.trim() === "" ? "This field is required" : null,
      city: (value) => (value.trim() === "" ? "This field is required" : null),
      state: (value) => (value.trim() === "" ? "This field is required" : null),
      country: (value) =>
        value.trim() === "" ? "This field is required" : null,
      zipCode: (value) =>
        value.trim() === "" ? "This field is required" : null,
    },
  });

  const addressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess(data, variables, context) {
      console.log(data);

      onClose();

      form.reset();

      void queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const onSubmit = form.onSubmit((values) => {
    console.log(values);
    // not catching exclude type util
    addressMutation.mutate(values as any);
  });

  return (
    <Modal title="Add new address" opened={opened} onClose={onClose} centered>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput placeholder="Address" {...form.getInputProps("address")} />
          <TextInput placeholder="City" {...form.getInputProps("city")} />

          <Select
            placeholder="Region"
            data={regions}
            {...form.getInputProps("state")}
          />

          <Select
            placeholder="Country"
            data={[{ value: "uzbekistan", label: "Uzbekistan" }]}
            disabled
            {...form.getInputProps("country")}
          />

          <TextInput
            type="number"
            placeholder="Zip code"
            {...form.getInputProps("zipCode")}
          />

          <Switch
            label="Set as default"
            {...form.getInputProps("isDefault", { type: "checkbox" })}
          />

          <Button
            type="submit"
            variant="light"
            className="self-end"
            loading={addressMutation.isPending}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
