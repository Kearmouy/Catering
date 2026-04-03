import GuestNavbar from "./components/GuestNavbar";
import AdminReturnButton from "./components/AdminReturnButton";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GuestNavbar />
      <main className="pt-36 sm:pt-20 px-4 sm:px-6">{children}</main>
      <AdminReturnButton />
    </>
  );
}