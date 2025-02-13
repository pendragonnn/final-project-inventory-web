"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import TableOutlets from "@/components/Tables/TableOutlet";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Import correctly

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

	return (
		user && (
			<SidebarLayout>
				<Breadcrumb pageName="Table Outlets" />
				<div className="flex flex-col gap-10">
					<TableOutlets />
				</div>
			</SidebarLayout>
		)
	);
};

export default TablesPage;
