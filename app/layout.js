
"use client"; // Ensure this is a client component

import { SessionProvider } from "next-auth/react";
import "./globals.css"; // Import Tailwind CSS


export default function RootLayout({ children }) { // Removed TypeScript syntax
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

