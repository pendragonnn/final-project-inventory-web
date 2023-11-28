import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Profile from "@/components/Profile/Profile";
import SidebarLayout from "../sidebar-layout";

const Profiles = () => {
  return (
    <SidebarLayout>
      <Breadcrumb pageName="Profile" />

      <Profile />
    </SidebarLayout>
  );
};
export default Profiles;
