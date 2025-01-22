import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PWAInstallPrompt } from '@/components/ui/pwa-install-prompt';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LockNRoll',
  description: 'A simple and elegant lock/unlock app',
  manifest: '/manifest.json',
  themeColor: '#1f2937',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}