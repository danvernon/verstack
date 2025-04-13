"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const configurationFormSchema = z.object({
  locations: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
});

type ConfigurationFormValues = z.infer<typeof configurationFormSchema>;

export function ConfigurationForm() {
  const utils = api.useUtils();

  const { data: company } = api.company.getConfigurations.useQuery();
  const updateConfigurations = api.company.updateConfigurations.useMutation({
    onSuccess: async () => {
      await utils.company.getConfigurations.invalidate();
    },
  });

  const defaultValues: Partial<ConfigurationFormValues> = {
    locations: [],
  };

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(configurationFormSchema),
    defaultValues,
    // mode: "onChange",
  });

  useEffect(() => {
    if (company) {
      form.reset({
        locations: company?.locations?.map((location) => ({
          value: location.name,
        })),
      });
    }
  }, [company, form]);

  const { fields, append } = useFieldArray({
    name: "locations",
    control: form.control,
  });

  async function onSubmit(data: ConfigurationFormValues) {
    const id = toast.loading("Updating configurations...");
    console.log({ data });
    try {
      await updateConfigurations.mutateAsync({
        ...data,
      });

      toast.success("Configurations updated successfully", { id });
      form.reset();
    } catch (error) {
      toast.error("Error updating configurations", { id });
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="max-w-sm space-y-1">
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`locations.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Locations
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={company?.locations?.some(
                        (location) => location.name === field.value,
                      )}
                    />
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
            Add location
          </Button>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
