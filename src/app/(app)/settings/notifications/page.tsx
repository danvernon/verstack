import { Separator } from "@/components/ui/separator";

export default function SettingsConfigurationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-muted-foreground text-sm">
          Manage your notifications settings. Set your preferred notification
          method and frequency.
        </p>
      </div>
      <Separator />
      {/* <AccountForm /> */}
    </div>
  );
}
