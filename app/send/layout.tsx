import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Sent",
};

export default function SendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
