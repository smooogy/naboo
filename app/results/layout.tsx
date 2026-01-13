import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
