import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Kalvikaram",
  description: "Kalvikaram is a platform for learning and teaching for tamil medium students.",
  // icons: [
  //   {
  //     href: "/icons/dark.svg",
  //     sizes: "32x32",
  //     type: "image/svg",
  //   },
  // ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link href="https://api.fontshare.com/v2/css?f[]=general-sans@1&display=swap" precedence="default" rel="stylesheet" />
    <link rel="icon" href="/icons/dark.svg" sizes="32x32" type="image/svg+xml" />
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
