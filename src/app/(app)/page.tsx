import { Suspense } from "react";
import { redirect } from "next/navigation";
import CreateCompany from "@/components/company/create-company";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Spinner } from "@/components/spinner";
import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const user = (await api.user.getUser()) ?? (await api.user.create());

    if (!user) {
      throw new Error("Failed to get or create user");
    }

    const hasCompany = await api.company.get();

    if (!hasCompany) {
      return (
        <div className="flex w-full justify-center">
          <CreateCompany />
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="flex w-full justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <HydrateClient>
          <Dashboard />
        </HydrateClient>
      </Suspense>
    );
  } catch {
    return (
      <div className="flex w-full justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-800">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p>
            We&apos;re having trouble loading your data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
