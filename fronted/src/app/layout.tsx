import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import { Providers } from '@/components/providers';
import RecaptchaProvider from '@/components/RecaptchaProvider';
import { GoogleTagManager, } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Libre_Baskerville, Nunito, Poppins } from "next/font/google";
import Script from "next/script";
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
    icon: '/assets/images/favicon.png',
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
      <head>
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JCDM3Y66CJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JCDM3Y66CJ');
          `}
        </Script>
      </head>
      <body className={`${poppins.className} ${nunito.className} ${libreBaskerville.className} min-h-screen bg-background text-foreground`}>
        <RecaptchaProvider>
          <Providers>
            <NavigationBar />
            <main>
              {children}
            </main>
            <Footer />  
          </Providers>
        </RecaptchaProvider>
        <GoogleTagManager gtmId={process.env?.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''} />
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
