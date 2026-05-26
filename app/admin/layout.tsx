import type { Metadata } from "next";

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
      {children}
    </div>
  )
}