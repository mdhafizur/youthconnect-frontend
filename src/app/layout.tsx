"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "./common/context/AuthContext";
import Head from "next/head"; // Import Head for metadata
import { Toaster } from "react-hot-toast";
import Navbar from "./common/components/layouts/Navbar";
import Footer from "./common/components/layouts/Footer";
import Sidebar from "./common/components/layouts/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="en">
      <Head>
        <title>YouthConnect</title>
        <meta
          name="description"
          content="Empowering Chemnitz Youth: Your Guide to Education & Care Facilities"
        />
      </Head>
      <body className={`${inter.className} flex flex-col h-screen`}>
        <AuthProvider>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <Navbar
            className="h-[10vh] fixed top-0 left-0 right-0 z-30 flex items-center justify-between"
            toggleSidebar={toggleSidebar}
          />{" "}
          <div className="flex flex-col flex-grow pt-[10vh] pb-[8vh] overflow-hidden">
            <Toaster position="top-right" />
            <main className="flex-grow overflow-auto bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-opacity-50">
              {children}
            </main>
            <Footer className="h-[8vh] fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center" />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
