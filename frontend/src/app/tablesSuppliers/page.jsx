"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useEffect } from "react";
import TableSuppliers from "@/components/Tables/TableOutlet";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/navigation";

const TablesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Berikan nilai awal pada useState

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUser(role);
    console.log(role);

    if (role && role !== 2) {

      router.push("/dashboard");
    }
  }, []);

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Tables" />
        <div className="flex flex-col gap-10">
          <TableSuppliers />
        </div>
      </SidebarLayout>
    );
  } else {
    return null; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
  }
};

export default TablesPage;
