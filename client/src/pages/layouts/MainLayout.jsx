import NavBar from "@/components/NavBar";
import SideArea from "@/components/SideArea";
import Panel from "@/components/Panel";

const MainLayout = () => {
  // check user role

  return (
    <div className="font-poppins flex min-h-screen">
      <SideArea />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <Panel />
      </div>
    </div>
  );
};

export default MainLayout;
