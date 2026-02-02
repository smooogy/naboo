import type { Metadata } from 'next';
import './tamtam.css';

export const metadata: Metadata = {
  title: 'Naboo – Corporate event management',
  description: 'Save time & money on your corporate events',
};

export default function TamtamLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tamtam-page">
      <link
        rel="stylesheet"
        href="https://fonts.cdnfonts.com/css/tt-hoves-pro-trial"
      />
      {children}
    </div>
  );
}
