"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableItems from "@/components/Tables/TableItem";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const TablesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Berikan nilai awal pada useState

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
        <Breadcrumb pageName="Table Items" />
        <div className="flex flex-col gap-10">
          <TableItems />
        </div>
      </SidebarLayout>
    );
  } else {
    return null; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
  }
};

export default TablesPage;
