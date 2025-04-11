"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { CardDescription, CardTitle } from "../ui/card";

export function Header() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between space-x-2 border-b px-6 pb-6">
      <div>
        <CardTitle>Requisitions</CardTitle>
        <CardDescription>
          Manage your requisitions and create new ones.
        </CardDescription>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          router.push("/create");
        }}
      >
        <span className="hidden md:inline">Create Job</span>
        <span className="inline md:hidden">New</span>
      </Button>
    </div>
  );
}
