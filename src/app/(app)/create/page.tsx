"use client";

import { useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const reqFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  level: z.string().min(1, {
    message: "Level is required",
  }),
  typeId: z.string().min(1, {
    message: "Type is required",
  }),
  subTypeId: z.string().min(1, {
    message: "Subtype is required",
  }),
  reasonId: z.string().min(1, {
    message: "Reason is required",
  }),
  locationId: z.string().min(1, {
    message: "Location is required",
  }),
});

type RequisitionFormValues = z.infer<typeof reqFormSchema>;

const defaultValues: Partial<RequisitionFormValues> = {
  title: "",
  level: "",
};

export default function CreateForm() {
  const router = useRouter();

  const form = useForm<RequisitionFormValues>({
    resolver: zodResolver(reqFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const createRequisition = api.requisition.create.useMutation();

  async function onSubmit(data: RequisitionFormValues) {
    const id = toast.loading("Creating requisition...");
    try {
      const res = await createRequisition.mutateAsync({
        ...data,
      });

      toast.success("Requisition created successfully", { id });
      form.reset();

      router.push(`/view/${res?.id}`);
    } catch (error) {
      toast.error("Error creating requisition", { id });
      console.error(error);
    } finally {
      form.reset();
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Broker" {...field} />
                </FormControl>
                <FormDescription>
                  This is the title of the job. It will be visible to all users.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job level</FormLabel>
                <FormControl>
                  <Input placeholder="Grade 4, VP, etc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Job type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4 lg:grid-cols-5"
                  >
                    {/* {reqFormSchema.shape.type.options.map((option) => (
                      <FormItem
                        className="flex items-center space-y-0 space-x-3"
                        key={option}
                      >
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {formatStringValue(option)}
                        </FormLabel>
                      </FormItem>
                    ))} */}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subTypeId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Position type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4 lg:grid-cols-5"
                  >
                    {/* {reqFormSchema.shape.subType.options.map((option) => (
                      <FormItem
                        className="flex items-center space-y-0 space-x-3"
                        key={option}
                      >
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {formatStringValue(option)}
                        </FormLabel>
                      </FormItem>
                    ))} */}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reasonId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Requisition reason</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4 lg:grid-cols-5"
                  >
                    {/* {reqFormSchema.shape.reason.options.map((option) => (
                      <FormItem
                        className="flex items-center space-y-0 space-x-3"
                        key={option}
                      >
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {formatStringValue(option)}
                        </FormLabel>
                      </FormItem>
                    ))} */}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4 lg:grid-cols-5"
                  >
                    {/* {reqFormSchema.shape.location.options.map((option) => (
                      <FormItem
                        className="flex items-center space-y-0 space-x-3"
                        key={option}
                      >
                        <FormControl>
                          <RadioGroupItem value={option} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {formatStringValue(option)}
                        </FormLabel>
                      </FormItem>
                    ))} */}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              createRequisition.isPending || form.formState.isSubmitting
            }
          >
            Create requisition
          </Button>
        </form>
      </Form>
    </div>
  );
}

function formatStringValue(value: string, capitalizeAll = false): string {
  if (!value) return "Unknown";

  // Replace underscores with spaces and convert to lowercase
  const processed = value.replace(/_/g, " ").toLowerCase();

  if (capitalizeAll) {
    // Title case: capitalize each word
    return processed
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else {
    // Sentence case: only capitalize first word
    return processed.charAt(0).toUpperCase() + processed.slice(1);
  }
}
