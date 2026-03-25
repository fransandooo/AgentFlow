import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgentFlow',
  description: 'Realtime orchestration for tasks, humans and agents',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
