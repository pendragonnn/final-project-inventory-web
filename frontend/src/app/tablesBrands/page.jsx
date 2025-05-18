"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import TableBrands from "@/components/Tables/TableBrand";

const TablesPage = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = Cookies.get("token");

		if (token) {
			try {
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
		} else {
			router.push("/login");
		}
	}, [router]);

	if (user) {
		return (
			<SidebarLayout>
				<Breadcrumb pageName="Table Brands" />
				<div className="flex flex-col gap-10">
					<TableBrands />
				</div>
			</SidebarLayout>
		);
	} else {
		return null;
	}
};

export default TablesPage;
