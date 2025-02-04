"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import TableOutlets from "@/components/Tables/TableOutlet";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const TablesPage = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const role = jwtDecode(Cookies.get("token")).role;
		setUser(role);

		if (!role) {
			router.push("/forbidden");
		}
	}, [router]);

	if (user) {
		return (
			<SidebarLayout>
				<Breadcrumb pageName="Table Outlets" />
				<div className="flex flex-col gap-10">
					<TableOutlets />
				</div>
			</SidebarLayout>
		);
	} else {
		return null;
	}
};

export default TablesPage;
