import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "PinkBlue Docs – Developer Documentation",
  description: "Official documentation for PinkBlue Dev platform including guides, API reference, tutorials, and integration help.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="android-chrome-192x192.png" />
        <meta name="theme-color" content="#5E48F0" />
      </head>
      <body
        className=
        "min-h-screen bg-background font-sans antialiased bg-[url('https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/docs-right.png')] bg-no-repeat bg-left bg-center bg-contain "     >
        <SidebarProvider>
          <AppSidebar />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >

            <main className="w-full h-screen ">
              <Navbar />
              <div className="container mx-auto p-4 ">
                {children}
              </div>
            </main>
            <Toaster />
          </ThemeProvider>
        </SidebarProvider>

      </body>
    </html>
  );
}
