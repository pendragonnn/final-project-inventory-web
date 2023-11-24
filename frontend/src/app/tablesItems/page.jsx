import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import TableItems from "@/components/Tables/TableItem";
import SidebarLayout from "../sidebar-layout";
export const metadata = {
  title: "Tables Page | Next.js E-commerce Dashboard Template",
  description: "This is Tables page for TailAdmin Next.js",
  // other metadata
};
const TablesItems = () => {
  return (
    <SidebarLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableItems />
      </div>
    </SidebarLayout>
  );
};
export default TablesItems;


