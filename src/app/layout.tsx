import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SceneFlow MVP',
  description: 'SceneFlow Variant B frontend scaffold',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
