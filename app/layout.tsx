import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const urbanist = Urbanist({
  weight: ["400", "500", "700"], // you can adjust these weights as needed
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "MotoVerse",
  description:
    "MotoVerse - Your premier marketplace for buying and selling automobiles. Find your perfect vehicle or list your car for sale in our trusted automotive community.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${urbanist.variable} antialiased`}>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </body>
      </SessionProvider>
    </html>
  );
}
