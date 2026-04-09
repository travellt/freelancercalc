import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'FreelancerCalc — Free Tax Tools for UK Freelancers',
    template: '%s | FreelancerCalc',
  },
  description:
    'Free, accurate calculators and tools for UK freelancers, contractors, and sole traders. Compare take-home pay, calculate day rates, check IR35 status, and more.',
  keywords: [
    'freelancer calculator',
    'UK freelancer tax',
    'sole trader vs limited company',
    'day rate calculator',
    'IR35 checker',
    'self-employed tax calculator',
    'contractor tax UK',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
