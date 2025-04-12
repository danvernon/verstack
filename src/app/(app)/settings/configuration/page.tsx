import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";

import { ConfigurationForm } from "../components/configuration-form";

export default async function SettingsConfigurationPage() {
  await api.company.get.prefetch();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuration</h3>
        <p className="text-muted-foreground text-sm">
          Manage your configuration settings.
        </p>
      </div>
      <Separator />
      <ConfigurationForm />
    </div>
  );
}
