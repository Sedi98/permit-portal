import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
// import PageLayout from "@/app/layouts/PageLayout";

const DashLayout = () => {
  return (
    <div className="flex h-screen bg-[#f5f7fb]">
      <Sidebar />
      <main className="min-w-0 flex-1 ">
        <div className="flex max-h-[calc(100vh-5px)] overflow-scroll flex-col gap-4">
          <Header />

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashLayout;
