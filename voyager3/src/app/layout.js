import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Voyager3",
  description: "The universe at your fingertips.",
  icon: [
    { url: '/Voyager3Logo.ico' },
    { url: '/Voyager3Logo.ico', sizes: '16x16' },
    { url: '/Voyager3Logo.ico', sizes: '32x32' },
  ],
  apple: [
    { url: '/Voyager3Logo.png', sizes: '180x180' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bungee+Hairline&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
