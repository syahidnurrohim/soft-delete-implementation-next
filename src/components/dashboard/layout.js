"use client";

import { SidebarProvider, useSidebarContext } from "@/context/SidebarContext";
import { twMerge } from "tailwind-merge";
import { DashboardNavbar } from "./navbar";
import { DashboardSidebar } from "./sidebar";

const DashboardLayout = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
};

const DashboardLayoutContent = function ({ children }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <>
      <DashboardNavbar />
      <div className="mt-16 flex items-start">
        <DashboardSidebar />
        <div
          id="main-content"
          className={twMerge(
            "relative h-full w-full overflow-y-auto px-10 py-8 bg-gray-50 dark:bg-gray-900",
            isCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64",
          )}
        >
          <div className="w-full block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
