"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect } from "react";
import TableUser from "@/components/Tables/TableUser";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";

const TablesPage = () => {
  const router = useRouter(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log(role);

    if (role && role !== "1") {
      router.push("/dashboard");
    }
  }, []);
  
  return (
    <SidebarLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableUser />
      </div>
    </SidebarLayout>
  );
};
export default TablesPage;
