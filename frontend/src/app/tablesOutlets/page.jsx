"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect } from "react";
import TableOutlets from "@/components/Tables/TableOutlet";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";

const TablesPage = () => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log(role);

    if (role && role !== 2) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <SidebarLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOutlets />
      </div>
    </SidebarLayout>
  );
};
export default TablesPage;
