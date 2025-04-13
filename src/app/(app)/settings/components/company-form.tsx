"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
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

const companyFormSchema = z.object({
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  logo: z.string().url({ message: "Please enter a valid URL." }),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export function CompanyForm() {
  const utils = api.useUtils();

  const { data: company } = api.company.get.useQuery();
  const updateCompany = api.company.update.useMutation({
    onSuccess: async () => {
      await utils.company.get.invalidate();
    },
  });

  const defaultValues: Partial<CompanyFormValues> = {
    name: company?.name ?? "",
    logo: company?.logo ?? "",
  };

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name ?? "",
        logo: company.logo ?? "",
      });
    }
  }, [company, form]);

  async function onSubmit(data: CompanyFormValues) {
    const id = toast.loading("Updating company...");
    try {
      await updateCompany.mutateAsync({
        ...data,
      });

      toast.success("Company updated successfully", { id });
      form.reset();
    } catch (error) {
      toast.error("Error updating company", { id });
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input placeholder="Acme" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company logo</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://1000logos.net/wp-content/uploads/2016/10/ACME-Logo-1981.png"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
