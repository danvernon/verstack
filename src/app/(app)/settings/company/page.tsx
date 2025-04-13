import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";

import { CompanyForm } from "../components/company-form";

export default async function SettingsCompanyPage() {
  await api.company.get.prefetch();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Company</h3>
        <p className="text-muted-foreground text-sm">
          Manage your company settings.
        </p>
      </div>
      <Separator />
      <CompanyForm />
    </div>
  );
}
