import { Outlet } from "react-router";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
// import PageLayout from "@/app/layouts/PageLayout";

const DashLayout = () => {
  return (
    <div className="flex h-screen bg-[#f5f7fb] print:block print:h-auto print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="min-w-0 flex-1 print:block">
        <div className="flex max-h-[calc(100vh-5px)] overflow-scroll flex-col gap-4 print:block print:max-h-none print:overflow-visible">
          <div className="print:hidden">
            <Header />
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashLayout;
