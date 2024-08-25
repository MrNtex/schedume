import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AuthProvider } from "@/context/AuthContext";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import UserHeader from "@/components/UserHeader";


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
    <header className="flex justify-between items-center p-4 sm:p-8 gap-4 backdrop-blur-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold"><a href="./">ScheduMe</a></h1>
      <nav>
        <UserHeader />
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
      <AuthProvider>
      <body className={ 'flex flex-col w-full mx-auto text-sm sm:text-base min-h-screen justify-between' + inter.className}>
        <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
        {header}
        {children}
        {footer}
        <Toaster/>
        </ThemeProvider>
      </body>
      </AuthProvider>
    </html>
  );
}
