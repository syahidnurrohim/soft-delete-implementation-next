import { useSidebarContext } from "@/context/SidebarContext";
import { Sidebar } from "flowbite-react";
import { HiChartPie, HiAcademicCap } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

export const DashboardSidebar = function () {
  const { isCollapsed } = useSidebarContext();

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      id="sidebar"
      className={twMerge(
        "fixed inset-y-0 left-0 z-20 mt-16 flex h-full shrink-0 flex-col border-r border-gray-200 duration-75 dark:border-gray-700 lg:flex",
        isCollapsed && "hidden w-16",
      )}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/students" icon={HiAcademicCap}>
            Students
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
