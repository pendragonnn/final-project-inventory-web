"use client";
import { useRouter } from "next/navigation";
import SignIn from "./auth/login/page";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Home() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			router.push("/dashboard"); // Ganti dengan halaman yang sesuai
		} else {
			setIsLoading(false);
		}
	}, [router]);

	if (isLoading) {
		return null; // Tidak render login sampai verifikasi selesai
	}

	return <SignIn />;
}
