import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScheduMe",
  description: "Scheduling made painless",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = (
    <header className="flex justify-between items-center p-4 sm:p-8 gap-4">
      <h1 className="text-2xl font-bold">ScheduMe</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
        </ul>
      </nav>
    </header>
  );

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p>&copy; 2024 ScheduMe</p>
      <p>Built by Artur Niemiec 💛</p>
    </footer>
  );

  return (
    <html lang="en">
      <body className={ 'w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col h-screen justify-between' + inter.className}>
        {header}
        {children}
        {footer}
      </body>
    </html>
  );
}
