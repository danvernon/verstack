"use client";

import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Link, Route, Routes } from "react-router";

import { trpc, TRPCProvider } from "@/utils/trpc";

export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={(props) => <div>Error: {props.error.message}</div>}
    >
      <TRPCProvider>
        {/* // SkewProtectionBuster // PostHog */}
        <BrowserRouter>
          {/* Force Onboarding */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </TRPCProvider>
    </ErrorBoundary>
  );
}

function Dashboard() {
  const { data, isLoading, error } = trpc.posts.getLatest.useQuery();

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
      {data && <p>Name: {data.name}</p>}
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
