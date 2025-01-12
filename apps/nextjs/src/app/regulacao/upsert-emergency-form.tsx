"use client";

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

export function UpsertEmergencyForm() {
  const { protocol } = useProtocol();

  const form = useForm({
    schema: upsertEmergencySchema,
    defaultValues: {
      city: "Fortaleza",
      complement: "",
      landmark: "",
      neighborhood: "",
      street: "",
      streetNumber: "",
      title: "",
      protocolId: protocol?.id,
    },
    values: protocol?.emergency ? protocol.emergency : undefined,
  });

  const utils = api.useUtils();

  const { mutate } = api.emergencies.upsert.useMutation({
    onSuccess: () => utils.protocols.ofMine.invalidate(),
  });

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
