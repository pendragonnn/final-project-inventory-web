"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import TableCategories from "@/components/Tables/TableCategories";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/common/Loader";

const TablesPage = () => {
	const router = useRouter();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const role = jwtDecode(Cookies.get("token")).role;
		setUser(role);

		if (!role) {
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
				<Breadcrumb pageName="Table Categories" />
				<div className="flex flex-col gap-10">
					<TableCategories loading={loading} setLoading={setLoading} />
				</div>
			</SidebarLayout>
		);
	} else {
		return null; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
	}
};

export default TablesPage;
