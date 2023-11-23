import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SidebarLayout from "../sidebar-layout";
import TableUser from "@/components/Tables/TableUser";
export const metadata = {
  title: "Tables Page | Next.js E-commerce Dashboard Template",
  description: "This is Tables page for TailAdmin Next.js",
  // other metadata
};
const TablesPage = () => {
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
