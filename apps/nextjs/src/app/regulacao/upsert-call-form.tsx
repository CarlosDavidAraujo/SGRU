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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { upsertCallSchema } from "@acme/validators/calls";

import { api } from "~/trpc/react";
import { useProtocol } from "./protocol-provider";

export function UpsertCallForm() {
  const { protocol } = useProtocol();

  const form = useForm({
    schema: upsertCallSchema,
    defaultValues: {
      codeArea: 85,
      complain: "",
      fone: "",
      requesterName: "",
    },
    values: protocol?.call
      ? { ...protocol.call, typeId: protocol.call.typeId }
      : undefined,
  });

  const utils = api.useUtils();

  const { mutate } = api.calls.upsert.useMutation({
    onSuccess: async () => utils.protocols.ofMine.invalidate(),
    onError: ({ message }) => console.log(message),
  });

  const [callOrigins] = api.callOrigin.all.useSuspenseQuery();
  const [callTypes] = api.callTypes.all.useSuspenseQuery();

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit((values) => mutate(values))}
      >
        <FormField
          control={form.control}
          name="codeArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DDD*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone*</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requesterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do solicitante*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="complain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Queixa/Motivo*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="originId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origem da ligação*</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(+value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {callOrigins.map((origin) => (
                    <SelectItem key={origin.id} value={origin.id.toString()}>
                      {origin.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de ligação</FormLabel>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(+value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {callTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button>Salvar ligação</Button>
      </form>
    </Form>
  );
}
