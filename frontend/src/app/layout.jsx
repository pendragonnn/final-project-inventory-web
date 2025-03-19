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
					name="viewport"
					content="width=device-width, initial-scale=1.0, user-scalable=no"
				/>
				<meta
					name="description"
					content="Shoe inventory manager website called ShoeStock."
				/>
				<link rel="icon" type="image/x-icon" href="/images/favicon.ico" />
				<title>ShoeStock</title>
			</head>
			<body suppressHydrationWarning={true} className="min-h-screen">
				<div className="dark:bg-boxdark-2 dark:text-bodydark">
					{loading ? <Loader /> : children}
				</div>
			</body>
		</html>
	);
}
