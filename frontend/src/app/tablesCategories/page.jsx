"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import TableCategories from "@/components/Tables/TableCategories";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TablesPage = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		try {
			const token = Cookies.get("token");
			if (!token) throw new Error("Token not found");

			const decodedToken = jwtDecode(token);
			const role = decodedToken?.role;

			if (!role) {
				throw new Error("Invalid role");
			}

			setUser(role);
		} catch (error) {
			console.error("Authentication error:", error.message);
			router.push("/forbidden");
		}
	}, [router]);

	if (user) {
		return (
			<SidebarLayout>
				<Breadcrumb pageName="Table Categories" />
				<div className="flex flex-col gap-10">
					<TableCategories />
				</div>
			</SidebarLayout>
		);
	} else {
		return null; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
	}
};

export default TablesPage;
