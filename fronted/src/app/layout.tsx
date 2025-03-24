import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import { Providers } from '@/components/providers';
import type { Metadata } from "next";
import { Libre_Baskerville, Nunito, Poppins } from "next/font/google";
import "../styles/globals.css";

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'] });
const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: "Crown Hair Fibers",
  description: "Crown Hair Fibers USA - Premium Hair Building Fibers for Thinning Hair",
  keywords: ["Hair fibers", "hair", "hair repairs", "concealers", "hair loss", "hair thinning", "hair restoration", "hair care", "hair products", "hair styling", "hair treatments", "hair solutions", "hair growth", "hair health", "hair beauty", "hair cosmetics", "hair accessories", "hair tools", "hair appliances", "hair equipment", "hair supplies", "hair merchandise", "hair goods", "hair items", "hair essentials", "hair necessities", "hair requirements", "hair needs"],
  authors: [{ name: "Crown Hair Fibers" }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} ${nunito.className} ${libreBaskerville.className} min-h-screen bg-background text-foreground`}>
        <Providers>
          <NavigationBar />
          <main>
            {children}
          </main>
          <Footer />  
        </Providers>
      </body>
    </html>
  );
}
