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
    "Professional portfolio of Sagar Kanda, Artificial Intelligence and Data Science Student from SRKR building premium, high-performance web experiences.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sagar Kanda | Portfolio",
    description:
      "Professional portfolio of Sagar Kanda, Artificial Intelligence and Data Science Student from SRKR building premium, high-performance web experiences.",
    images: [
      {
        url: "https://drive.google.com/file/d/1dOP9b8QdRqYT2TUuX0WLChTVY_2F_S12/view?usp=sharing",
        width: 1200,
        height: 630,
        alt: "Sagar Kanda | Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagar Kanda | Portfolio",
    description:
      "Professional portfolio of Sagar Kanda, Artificial Intelligence and Data Science Student from SRKR building premium, high-performance web experiences.",
    images: ["https://drive.google.com/file/d/1dOP9b8QdRqYT2TUuX0WLChTVY_2F_S12/view?usp=sharing"],
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
