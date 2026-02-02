import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Naboo – Corporate event venues',
  description: 'Find and book your next corporate meeting venue',
};

export default function HomeV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
