import { ChangePasswordForm } from "./components/change-password-form";
export default async function ChangePassword() {
  return (
    <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Change Password</h2>
      </div>
      <div className="flex sm:flex-1 items-center flex-wrap gap-2">
        <ChangePasswordForm />
      </div>
    </section>
  );
}
