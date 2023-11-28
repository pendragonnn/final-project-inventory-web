"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TableUser from "@/components/Tables/TableUser";

const TablesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Berikan nilai awal pada useState

  useEffect(() => {
    const role = Cookies.get("role");
    setUser(role);
    console.log(role);

    if (role && role !== "1") {
      router.push("/forbidden");
    }
  }, []);

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Tables" />
        <div className="flex flex-col gap-10">
          <TableUser />
        </div>
      </SidebarLayout>
    );
  } else {
    return null; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
  }
};

export default TablesPage;
