import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import TablesSupplier from "@/components/Tables/TableSuppliers";
import SidebarLayout from "../sidebar-layout";
import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "js-cookie";

const TablesPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null); // Berikan nilai awal pada useState

  useEffect(() => {
    const role = Cookies.get("role");
    setUser(role);
    console.log(role);

    if (role && role !== "2") {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/dashboard");
    }
  }, []);

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Tables" />

        <div className="flex flex-col gap-10">
          <TablesSupplier />
        </div>
      </SidebarLayout>
    );
  } else {
    return null; // Atau tampilkan pesan loading atau lainnya jika user belum di-set
  }
};
export default TablesPage;
