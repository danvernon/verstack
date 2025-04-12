import { UserProfile } from "@clerk/nextjs";

export default async function Settings() {
  return (
    <div className="flex w-full justify-center">
      <UserProfile />
    </div>
  );
}
