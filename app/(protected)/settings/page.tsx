import { Separator } from "@/components/ui/separator";
import { API } from "@/lib/fetch";
import { User } from "@/models/user";
import { ProfileForm } from "./profile-form";
async function getListWithCount(): Promise<{
  user: User | undefined;
  count: number;
}> {
  try {
    const { data, error } = await API.Me();
    if (error) throw error;
    return { ...data };
  } catch (error) {
    return { user: undefined, count: 0 };
  }
}
export default async function SettingsProfilePage() {
  const { user } = await getListWithCount();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  );
}
