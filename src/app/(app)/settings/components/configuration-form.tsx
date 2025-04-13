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
  requisitionReasons: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
  workerTypes: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
  workerSubTypes: z
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
    locations: company?.locations?.map((location) => ({
      value: location.name,
    })),
    requisitionReasons: company?.requisitionReasons?.map((reason) => ({
      value: reason.name,
    })),
    workerTypes: company?.workerTypes?.map((type) => ({
      value: type.name,
    })),
    workerSubTypes: company?.workerSubTypes?.map((subType) => ({
      value: subType.name,
    })),
  };

  const form = useForm<ConfigurationFormValues>({
    resolver: zodResolver(configurationFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (company) {
      form.reset({
        locations: company.locations?.map((location) => ({
          value: location.name,
        })),
        requisitionReasons: company.requisitionReasons?.map((reason) => ({
          value: reason.name,
        })),
        workerTypes: company.workerTypes?.map((type) => ({
          value: type.name,
        })),
        workerSubTypes: company.workerSubTypes?.map((subType) => ({
          value: subType.name,
        })),
      });
    }
  }, [company, form]);

  const { fields: locationFields, append: appendLocation } = useFieldArray({
    name: "locations",
    control: form.control,
  });

  const { fields: reasonFields, append: appendReason } = useFieldArray({
    name: "requisitionReasons",
    control: form.control,
  });

  const { fields: typeFields, append: appendType } = useFieldArray({
    name: "workerTypes",
    control: form.control,
  });

  const { fields: subTypeFields, append: appendSubType } = useFieldArray({
    name: "workerSubTypes",
    control: form.control,
  });

  async function onSubmit(data: ConfigurationFormValues) {
    const id = toast.loading("Updating configurations...");

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
          {locationFields.map((field, index) => (
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
                    Description TBA.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={company?.locations?.some(
                        (opt) => opt.name === field.value,
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
            onClick={() => appendLocation({ value: "" })}
          >
            Add location
          </Button>
        </div>
        <div className="max-w-sm space-y-1">
          {reasonFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`requisitionReasons.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Requisition reasons
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Description TBA.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={company?.requisitionReasons?.some(
                        (opt) => opt.name === field.value,
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
            onClick={() => appendReason({ value: "" })}
          >
            Add reason
          </Button>
        </div>
        <div className="max-w-sm space-y-1">
          {typeFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`workerTypes.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Worker type
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Description TBA.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={company?.workerTypes?.some(
                        (opt) => opt.name === field.value,
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
            onClick={() => appendType({ value: "" })}
          >
            Add type
          </Button>
        </div>
        <div className="max-w-sm space-y-1">
          {subTypeFields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`workerSubTypes.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Worker sub type
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Description TBA.
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={company?.workerSubTypes?.some(
                        (opt) => opt.name === field.value,
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
            onClick={() => appendSubType({ value: "" })}
          >
            Add sub type
          </Button>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
