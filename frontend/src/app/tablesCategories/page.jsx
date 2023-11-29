"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect, useState } from "react";
import TableCategories from "@/components/Tables/TableCategories";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const TablesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const role = Cookies.get("role");
    setUser(role);
    console.log(role);

    if (!role) {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/forbidden");
    }
  }, []);

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Tables" />
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
