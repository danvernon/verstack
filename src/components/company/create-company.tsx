"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateCompanySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function CreateCompany() {
  const utils = api.useUtils();
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateCompanySchema>>({
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: {
      name: "",
    },
  });

  const createCompany = api.company.create.useMutation();

  async function onSubmit(data: z.infer<typeof CreateCompanySchema>) {
    const id = toast.loading("Creating company...");
    try {
      await createCompany.mutateAsync({
        ...data,
      });

      toast.success("Company created successfully", { id });
      form.reset();

      await utils.company.getCompany.invalidate();
      router.refresh();
    } catch (error) {
      toast.error("Error creating company", { id });
      console.error(error);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create company</CardTitle>
        <CardDescription>Create a new company to get started.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </form>
      </Form>
      <CardFooter>
        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={createCompany.isPending}
        >
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
