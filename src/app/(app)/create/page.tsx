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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const reqFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  levelId: z.string().min(1, {
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
    message: "Workplace is required",
  }),
  officeId: z.string().min(1, {
    message: "Office location is required",
  }),
});

type RequisitionFormValues = z.infer<typeof reqFormSchema>;

const defaultValues: Partial<RequisitionFormValues> = {
  title: "",
};

export default function CreateForm() {
  const router = useRouter();

  const form = useForm<RequisitionFormValues>({
    resolver: zodResolver(reqFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { data: company } = api.company.getConfigurations.useQuery();
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Job level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {company?.jobLevels.map((opt) => (
                        <SelectItem value={opt.id} key={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {company?.workerTypes.map((opt) => (
                        <SelectItem value={opt.id} key={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subTypeId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Employment type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an employment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {company?.workerSubTypes.map((opt) => (
                        <SelectItem value={opt.id} key={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {company?.requisitionReasons.map((opt) => (
                        <SelectItem value={opt.id} key={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Workplace</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a workplace" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {company?.locations.map((opt) => (
                        <SelectItem value={opt.id} key={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officeId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Office Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an office location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {company?.offices.map((opt) => (
                        <SelectItem value={opt.id} key={opt.id}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
