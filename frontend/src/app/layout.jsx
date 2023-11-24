"use client";
import "./globals.css";
import "./data-tables-css.css";
import { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="Shoe inventory manager website called ShoeStock."
        />
        <link rel="shortcut icon" href="/Logo.svg" type="image/x-icon" />
        <title>ShoeStock</title>
      </head>
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
      </body>
    </html>
  );
}
