"use client";

import { z } from "zod";

import { signIn } from "@acme/auth/react";
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

export default function LoginPage() {
  const form = useForm({
    schema: z.object({
      email: z.string().min(1).email(),
      password: z.string().min(1),
    }),
  });

  const onSubmit = form.handleSubmit((credentials) =>
    signIn("credentials", { ...credentials }),
  );

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button>Entrar</Button>
      </form>
    </Form>
  );
}
