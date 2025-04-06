// src/frontend/app.tsx
import { minimalApi } from "@/utils/minimal-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Dashboard } from "./features/dashboard";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    minimalApi.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc", // Use absolute URL for testing
        }),
      ],
    }),
  );

  return (
    <minimalApi.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </minimalApi.Provider>
  );
};

export default App;

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
