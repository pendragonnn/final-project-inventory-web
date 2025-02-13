"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableSuppliers from "@/components/Tables/TableSuppliers";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
				<Breadcrumb pageName="Table Suppliers" />
				<div className="flex flex-col gap-10">
					<TableSuppliers />
				</div>
			</SidebarLayout>
		);
	} else {
		return null;
	}
};

export default TablesPage;
