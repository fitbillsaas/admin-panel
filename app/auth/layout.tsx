import Image from "next/image";
import banner from "../../public/images/logos/banner.png";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-0 text-white dark:border-r lg:flex">
          <Image
            src={banner}
            className="object-cover w-full h-full"
            alt="Opus Logo"
            priority
          />
        </div>
        {children}
      </div>
    </>
  );
}
