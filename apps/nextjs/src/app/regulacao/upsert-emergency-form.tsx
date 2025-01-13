"use client";

import { useEffect } from "react";

import type { UpsertEmergencySchema } from "@acme/validators/emergencies";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { upsertEmergencySchema } from "@acme/validators/emergencies";

import { api } from "~/trpc/react";
import { useProtocol } from "./protocol-provider";

const defaultValues: UpsertEmergencySchema = {
  city: "Fortaleza",
  complement: "",
  landmark: "",
  neighborhood: "",
  street: "",
  streetNumber: 0,
  title: "",
  protocolId: 0,
};

export function UpsertEmergencyForm() {
  const { protocol } = useProtocol();

  const form = useForm({
    schema: upsertEmergencySchema,
    values: protocol?.emergency ? protocol.emergency : defaultValues,
  });

  const utils = api.useUtils();

  const { mutate } = api.emergencies.upsert.useMutation({
    onSuccess: () => utils.protocols.ofMine.invalidate(),
  });

  useEffect(() => {
    if (protocol) {
      form.setValue("protocolId", protocol.id);
    } else {
      form.reset();
    }
  }, [form, protocol]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutate(values))}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numeral*</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="landmark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ponto de referência*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento*</FormLabel>
              <FormControl>
                {/* @ts-expect-error */}
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button>Salvar ocorrência</Button>
      </form>
    </Form>
  );
}
