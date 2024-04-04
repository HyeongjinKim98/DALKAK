import React from 'react';
import { Metadata } from 'next';
import Navbar from '../components/common/Navbar';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'DALKAK',
  description: '당신의 칵테일 취향을 달칵',
  icons: {
    icon: '/dalkak.png',
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
