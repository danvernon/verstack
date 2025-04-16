import type { RenderOptions, RenderResult } from "@testing-library/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { render } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { vi } from "vitest";
import { type z } from "zod";

/**
 * Creates a wrapper component for testing form fields
 *
 * @param schema Zod schema for form validation
 * @param defaultValues Default values for the form
 * @returns A wrapper component for rendering form fields in tests
 */
export function createFormWrapper<T extends z.ZodTypeAny>(
  schema: T,
  defaultValues: Partial<z.infer<T>> = {},
) {
  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm<z.infer<T>>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues as z.infer<T>,
    });

    // Use a named function that comments its purpose to avoid empty function warning
    const handleSubmit = () => {
      // This is intentionally empty for testing purposes
      // The actual form submission logic would be implemented in the component under test
    };

    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>{children}</form>
      </FormProvider>
    );
  };

  FormWrapper.displayName = "FormWrapper";
  return FormWrapper;
}

/**
 * Renders a form field component within a form context for testing
 *
 * @param ui The component to render
 * @param schema Zod schema for form validation
 * @param defaultValues Default values for the form
 * @param options Additional render options
 * @returns The rendered component with testing utilities
 */
export function renderWithForm<T extends z.ZodTypeAny>(
  ui: React.ReactElement,
  schema: T,
  defaultValues: Partial<z.infer<T>> = {},
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult {
  const Wrapper = createFormWrapper(schema, defaultValues);
  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock for testing toast notifications
 */
export const createToastMock = () => {
  const toastMock = {
    loading: vi.fn().mockReturnValue("toast-id"),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
    custom: vi.fn(),
  };

  vi.doMock("sonner", () => ({
    toast: toastMock,
  }));

  return toastMock;
};
