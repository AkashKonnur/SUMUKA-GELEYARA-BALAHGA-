import { Cinzel, Inter, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  variable: "--font-kannada",
  subsets: ["kannada"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport = {
  themeColor: "#160d08",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ | 11th Year Ganeshotsava 2026",
  description:
    "Celebrating 11 years of faith, devotion and unity. Join Sumuka Geleyara Balaga for three divine days of Ganeshotsava — September 14–16, 2026, Kengeri, Bengaluru.",
  keywords: [
    "Ganeshotsava",
    "Ganesh Chaturthi",
    "Sumuka Geleyara Balaga",
    "Kengeri",
    "Bengaluru",
    "2026",
    "Hindu Festival",
  ],
  openGraph: {
    title: "ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ — Ganeshotsava 2026",
    description:
      "11 Years of Faith • Devotion • Unity. September 14–16, 2026.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} ${notoKannada.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
