import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Geist } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ClickSpark from "@/components/ui/ClickSpark";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Sagar Kanda | Portfolio",
  description:
    "Professional portfolio of Sriram Gandrothu, ECE Software Engineer from SRKR building premium, high-performance web experiences.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sriram Gandrothu | Portfolio",
    description:
      "Professional portfolio of Sriram Gandrothu, ECE Software Engineer from SRKR building premium, high-performance web experiences.",
    images: [
      {
        url: "https://res.cloudinary.com/djizcuofs/image/upload/v1784918218/sg_ixm93a.png",
        width: 1200,
        height: 630,
        alt: "Sriram Gandrothu | Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sriram Gandrothu | Portfolio",
    description:
      "Professional portfolio of Sriram Gandrothu, ECE Software Engineer from SRKR building premium, high-performance web experiences.",
    images: ["https://res.cloudinary.com/djizcuofs/image/upload/v1784918218/sg_ixm93a.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        serif.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <SmoothScroll>
            <ClickSpark />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
