"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableItems from "@/components/Tables/TableItem";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
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
				<Breadcrumb pageName="Table Items" />
				<div className="flex flex-col gap-10">
					<TableItems />
				</div>
			</SidebarLayout>
		);
	} else {
		return null;
	}
};

export default TablesPage;
