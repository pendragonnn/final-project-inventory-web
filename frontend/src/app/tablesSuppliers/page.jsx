import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import TablesSupplier from "@/components/Tables/TableSuppliers";
export const metadata = {
  title: "Tables Page | Next.js E-commerce Dashboard Template",
  description: "This is Tables page for TailAdmin Next.js",
  // other metadata
};
const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TablesSupplier />
      </div>
    </>
  );
};
export default TablesPage;
