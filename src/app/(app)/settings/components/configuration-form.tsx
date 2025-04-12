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
import { util, z } from "zod";

const configurationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  logo: z.string().url({ message: "Please enter a valid URL." }),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: "Please enter a valid URL." }),
  //     }),
  //   )
  //   .optional(),
});

type ConfigurationFormValues = z.infer<typeof configurationFormSchema>;

export function ConfigurationForm() {
  const utils = api.useUtils();

  const { data: company } = api.company.get.useQuery();
  const updateCompany = api.company.update.useMutation({
    onSuccess: async () => {
      await utils.company.invalidate();
    },
  });

  const defaultValues: Partial<ConfigurationFormValues> = {
    name: "",
    logo: "",
    // bio: "I own a computer.",
    // urls: [
    //   { value: "https://shadcn.com" },
    //   { value: "http://twitter.com/shadcn" },
    // ],
  };

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(configurationFormSchema),
    defaultValues,
    // mode: "onChange",
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        logo: company.logo ?? "",
      });
    }
  }, [company, form]);

  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // });

  async function onSubmit(data: ConfigurationFormValues) {
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
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
