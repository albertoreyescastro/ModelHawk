import type { Metadata } from "next";
import "./globals.css";

const description =
  "Static ML notebook auditing with deterministic methodology checks, AI-assisted review and production PDF reports.";

export const metadata: Metadata = {
  metadataBase: new URL("https://modelhawk.onrender.com"),
  title: {
    default: "ModelHawk | Static ML Notebook Auditor",
    template: "%s | ModelHawk",
  },
  description,
  applicationName: "ModelHawk",
  keywords: [
    "machine learning",
    "ML audit",
    "Jupyter notebook",
    "model evaluation",
    "data leakage",
    "reproducibility",
  ],
  authors: [{ name: "Alberto Reyes Castro" }],
  creator: "Alberto Reyes Castro",
  openGraph: {
    type: "website",
    url: "/",
    title: "ModelHawk | Static ML Notebook Auditor",
    description,
    siteName: "ModelHawk",
    images: [{
      url: "/docs/screenshots/01-landing-page.png",
      width: 1440,
      height: 1000,
      alt: "ModelHawk static ML notebook auditor",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ModelHawk | Static ML Notebook Auditor",
    description,
    images: ["/docs/screenshots/01-landing-page.png"],
  },
  icons: { icon: "/modelhawk-favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
