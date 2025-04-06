"use client";

import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import { getQueryClient } from "./providers/trpc";
import { useState } from "react";
import { AppRouter } from "@/server/api/root";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";

import { TRPCProvider, useTRPC } from "@/utils/trpc";
import { env } from "@/env";

export default function App() {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          // transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <ErrorBoundary
      fallbackRender={(props) => <div>Error: {props.error.message}</div>}
    >
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          {/* // SkewProtectionBuster // PostHog */}
          <BrowserRouter>
            {/* Force Onboarding */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </TRPCProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function Dashboard() {
  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.hello.queryOptions({ text: "World" }),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/home">Go to Home</Link>
      {data && <p>Name: {data.greeting}</p>}
      {/* will either be home.tsx or settings.tsx */}
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/">Go to Dashboard</Link>
      {/* will either be home.tsx or settings.tsx */}
    </div>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
