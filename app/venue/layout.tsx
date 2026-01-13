import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue Details",
};

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
