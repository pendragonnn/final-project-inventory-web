"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import React from "react";

const Forbidden = ({ status, error, message }) => {
	const router = useRouter();

	const handleGoBack = () => {
		const token = Cookies.get("token");
		if (token) {
			window.history.go(-2); // Kembali 2 halaman sebelumnya
		} else {
			router.replace("/"); // Kembali ke halaman utama jika tidak ada token
		}
	};

	return (
		<div className="grid h-screen px-4 bg-sidebar place-content-center dark:bg-gray-900">
			<div className="text-center">
				<h1 className="font-black text-gray-200 text-9xl dark:text-gray-700">
					{status}
				</h1>

				<p className="text-2xl mt-2 font-bold tracking-tight text-white sm:text-4xl">
					{error}
				</p>

				<p className="mt-4 text-gray-400 text-xl">{message}</p>

				<button
					onClick={handleGoBack}
					className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-primary rounded hover:bg-indigo-700 focus:outline-none focus:ring"
				>
					Go Back
				</button>
			</div>
		</div>
	);
};

export default Forbidden;
