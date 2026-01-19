import { Outlet } from "react-router-dom";
import { Sidebar, SidebarProvider } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayout() {
    return (
        <div className="min-h-screen flex bg-gray-50 w-full">
            <SidebarProvider>
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Topbar />
                    <main className="p-4 overflow-auto flex-1">
                        <Outlet />
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}
