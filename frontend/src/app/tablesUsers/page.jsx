"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TableUser from "@/components/Tables/TableUser";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/common/Loader";

const TablesPage = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const role = jwtDecode(Cookies.get("token")).role;
		setUser(role);

		if (role !== "1" && role !== "3") {
			router.push("/forbidden");
		}
		const minimumLoading = new Promise((resolve) => setTimeout(resolve, 500));

		minimumLoading.then(() => {
			setLoading(false);
		});
	}, [router]);

	if (loading) {
		return <Loader />;
	}

	if (user) {
		return (
			<SidebarLayout>
				<Breadcrumb pageName="Table Users" />
				<div className="flex flex-col gap-10">
					<TableUser />
				</div>
			</SidebarLayout>
		);
	} else {
		return <p>Loading...</p>; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
	}
};

export default TablesPage;
