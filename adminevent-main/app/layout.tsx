import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ConditionalSidebar from '@/components/ConditionalSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniEvents Admin',
  description: 'Admin dashboard for UniEvents platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <ConditionalSidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}