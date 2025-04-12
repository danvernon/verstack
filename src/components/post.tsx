"use client";

import { Suspense } from "react";
import { api } from "@/trpc/react";
import Markdown from "react-markdown";

function GreetingContent() {
  const [hello] = api.post.hello.useSuspenseQuery();
  return (
    <div className="space-y-2">
      <Markdown>{hello.greeting}</Markdown>
    </div>
  );
}

function LoadingSpinner() {
  return <p className="animate-pulse">Loading AI response...</p>;
}

export function LatestPost() {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4">
        <Suspense fallback={<LoadingSpinner />}>
          <GreetingContent />
        </Suspense>
      </div>
    </div>
  );
}
