import './riv-design-system.css';

export default function RivLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="riv-page">{children}</div>;
}
