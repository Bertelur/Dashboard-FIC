import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, FileText, Receipt, Shield } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const links = [
    { to: "/", label: "Home", icon: LayoutDashboard, role: ["super-admin", "admin", "staff", "keuangan"] },
    { to: "/products", label: "Products", icon: Package, role: ["super-admin", "admin"] },
    { to: "/reports", label: "Reports", icon: FileText, role: ["super-admin", "admin", "keuangan"] },
    { to: "/invoices", label: "Invoices", icon: Receipt, role: ["super-admin", "admin", "keuangan"] },
    { to: "/role-management", label: "Role Management", icon: Shield, role: ["super-admin"] },
];

type SidebarCtx = {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    toggleCollapsed: () => void;

    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
    toggleMobile: () => void;
    closeMobile: () => void;
};

const Ctx = createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const value = useMemo<SidebarCtx>(
        () => ({
            collapsed,
            setCollapsed,
            toggleCollapsed: () => setCollapsed((p) => !p),

            mobileOpen,
            setMobileOpen,
            toggleMobile: () => setMobileOpen((p) => !p),
            closeMobile: () => setMobileOpen(false),
        }),
        [collapsed, mobileOpen]
    );

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSidebar() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
    return ctx;
}

export function Sidebar() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { collapsed, mobileOpen, closeMobile } = useSidebar();
    const desktopWidth = collapsed ? "w-16" : "w-64";
    const mobileTranslate = mobileOpen ? "translate-x-0" : "-translate-x-full";

    return (
        <>
            {!isDesktop && mobileOpen && (
                <button
                    aria-label="Close sidebar overlay"
                    className="fixed inset-0 z-40 bg-black/40"
                    onClick={closeMobile}
                />
            )}

            <aside
                className={[
                    "bg-white border-r h-screen transition-all duration-200",
                    isDesktop
                        ? `relative ${desktopWidth}`
                        : `fixed z-50 inset-y-0 left-0 w-64 transform ${mobileTranslate}`,
                ].join(" ")}
            >
                <div className="px-4 py-4 font-semibold flex items-center justify-between">
                    <span className={collapsed && isDesktop ? "sr-only" : ""}>Dashboard</span>
                    {collapsed && isDesktop && <span className="text-sm">DB</span>}
                </div>

                <nav className="px-2 space-y-1">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            onClick={() => {
                                if (!isDesktop) closeMobile();
                            }}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                                    isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50",
                                ].join(" ")
                            }
                            title={collapsed && isDesktop ? label : undefined}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className={collapsed && isDesktop ? "hidden" : ""}>{label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}