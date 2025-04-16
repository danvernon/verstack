import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { createMockRouter } from "@/vitest/utils/mocks/frontend/createMockRouter";
import { mockTRPCHooks } from "@/vitest/utils/mocks/frontend/mockTRPC";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, test, vi } from "vitest";

import CreateCompany from "./create-company";

// Mock dependencies
vi.mock("@/trpc/react", () => ({
  api: {
    company: {
      create: {
        useMutation: vi.fn(),
      },
      get: {
        invalidate: vi.fn(),
      },
    },
    useUtils: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CreateCompany", () => {
  // Setup mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock tRPC hooks
    mockTRPCHooks({
      company: {
        create: {
          mutateAsync: vi
            .fn()
            .mockResolvedValue({ id: "123", name: "Test Company" }),
          isPending: false,
        },
      },
      useUtils: vi.fn().mockReturnValue({
        company: {
          get: {
            invalidate: vi.fn().mockResolvedValue(undefined),
          },
        },
      }),
    });

    // Mock toast functions
    // (toast.loading as vi.Mock).mockReturnValue("toast-id");
    // (toast.success as vi.Mock).mockReturnValue(undefined);
    // (toast.error as vi.Mock).mockReturnValue(undefined);
  });

  test("renders the create company form", () => {
    const mockRouter = createMockRouter({});

    render(
      <RouterContext.Provider value={mockRouter}>
        <CreateCompany />
      </RouterContext.Provider>,
    );

    expect(screen.getByText("Create company")).toBeInTheDocument();
    expect(
      screen.getByText("Create a new company to get started."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Company name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  test("submits form with valid input", async () => {
    const user = userEvent.setup();
    const mockRouter = createMockRouter({
      refresh: vi.fn(),
    });

    // Access the mocked API using the vi.mocked utility
    const { api } = (await import("@/trpc/react")) as unknown as {
      api: ReturnType<typeof vi.fn>;
    };
    const mutateAsyncMock = vi
      .fn()
      .mockResolvedValue({ id: "123", name: "Acme Inc" });
    (api.company.create.useMutation as vi.Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    });

    render(
      <RouterContext.Provider value={mockRouter}>
        <CreateCompany />
      </RouterContext.Provider>,
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Company name"), "Acme Inc");

    // Submit the form
    await user.click(screen.getByRole("button", { name: "Create" }));

    // Verify loading toast was shown
    expect(toast.loading).toHaveBeenCalledWith("Creating company...");

    // Wait for mutation to complete
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Acme Inc",
      });
    });

    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith("Company created successfully", {
      id: "toast-id",
    });

    // Verify router was refreshed
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  test("shows error message on failed submission", async () => {
    const user = userEvent.setup();
    const mockRouter = createMockRouter({
      refresh: vi.fn(),
    });

    // Access the mocked API using the vi.mocked utility
    const { api } = (await import("@/trpc/react")) as {
      api: ReturnType<typeof vi.fn>;
    };
    const errorMsg = new Error("API Error");
    const mutateAsyncMock = vi.fn().mockRejectedValue(errorMsg);
    (api.company.create.useMutation as vi.Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    });

    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(
      <RouterContext.Provider value={mockRouter}>
        <CreateCompany />
      </RouterContext.Provider>,
    );

    // Fill out the form
    await user.type(screen.getByLabelText("Company name"), "Acme Inc");

    // Submit the form
    await user.click(screen.getByRole("button", { name: "Create" }));

    // Wait for error to be handled
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error creating company", {
        id: "toast-id",
      });
    });

    // Verify error was logged
    expect(console.error).toHaveBeenCalledWith(errorMsg);

    // Restore console.error
    console.error = originalConsoleError;
  });

  test("validates required field", async () => {
    const user = userEvent.setup();
    const mockRouter = createMockRouter({});

    render(
      <RouterContext.Provider value={mockRouter}>
        <CreateCompany />
      </RouterContext.Provider>,
    );

    // Try to submit with empty field
    await user.click(screen.getByRole("button", { name: "Create" }));

    // Check for validation message
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  test("disables button when submission is in progress", async () => {
    const mockRouter = createMockRouter({});

    // Access the mocked API using the vi.mocked utility
    const { api } = (await import("@/trpc/react")) as {
      api: ReturnType<typeof vi.fn>;
    };
    (api.company.create.useMutation as vi.Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    });

    render(
      <RouterContext.Provider value={mockRouter}>
        <CreateCompany />
      </RouterContext.Provider>,
    );

    // Button should be disabled
    expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
  });
});
