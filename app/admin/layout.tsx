import AdminNavbar from "./components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      <main className="pt-36 sm:pt-20 px-4 sm:px-6">{children}</main>
    </>
  );
}