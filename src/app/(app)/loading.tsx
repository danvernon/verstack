import { Spinner } from "@/components/spinner";

export default function Loading() {
  return (
    <div className="flex w-full justify-center">
      <Spinner size="lg" />
    </div>
  );
}
