import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Settings from "@/components/Form/Settings";
import SidebarLayout from "../sidebar-layout";

const Setting = () => {
  return (
    <SidebarLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <Settings />
      </div>
    </SidebarLayout>
  );
};
export default Setting;
