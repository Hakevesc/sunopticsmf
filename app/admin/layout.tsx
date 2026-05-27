import type { Metadata } from "next";
import { AuthGuard } from "@/components/admin/AuthGuard";

export const metadata: Metadata = {
  title: 'Admin | SunOptics Eye Clinic',
  description: 'Admin dashboard for SunOptics Eye Clinic',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthGuard>{children}</AuthGuard>
    </div>
  )
}
