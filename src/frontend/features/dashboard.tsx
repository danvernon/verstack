// src/frontend/pages/dashboard.tsx

import { minimalApi } from "@/utils/minimal-api";

export function Dashboard() {
  const { data, error, isLoading } = minimalApi.hello.useQuery({
    text: "friend",
  });

  return (
    <div>
      {isLoading ? "Loading..." : null}
      {error ? error.message : null}
      {data ? data.greeting : null}
    </div>
  );
}
