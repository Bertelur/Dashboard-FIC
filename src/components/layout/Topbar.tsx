import { Menu } from "lucide-react";
import { useAuth } from "../../features/auth/store/auth.store";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { useBreadcrumb } from "@/lib/hooks/useBreadcrumb";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useSidebar } from "./Sidebar";

export function Topbar() {
    const { user, logout } = useAuth();
    const breadcrumb = useBreadcrumb();

    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { toggleCollapsed, toggleMobile } = useSidebar();

    function onToggleSidebar() {
        if (isDesktop) toggleCollapsed();
        else toggleMobile();
    }

    return (
        <header className="h-14 border-b bg-white flex items-center justify-between px-4">
            <Button variant="outline" size="icon" onClick={onToggleSidebar} aria-label="Toggle sidebar">
                <Menu className="w-4 h-4" />
            </Button>

            {/* Left */}
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumb.map((crumb) => (
                        <div key={crumb.href} className="flex items-center">
                            <BreadcrumbItem>
                                {crumb.isLast ? (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!crumb.isLast && <BreadcrumbSeparator />}
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Right */}
            <div className="flex items-center gap-3">
                <div className="text-sm text-right">
                    <div className="font-medium">
                        {user?.username} ({user?.role})
                    </div>
                </div>

                <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                </Button>
            </div>
        </header>
    );
}