import { useLocation } from "react-router-dom";

type Breadcrumb = {
    label: string;
    href: string;
    isLast: boolean;
};

const ROUTE_LABELS: Record<string, string> = {
    "": "Home",
    products: "Products",
    new: "New Product",
    edit: "Edit Product",
    reports: "Reports",
    invoices: "Invoices",
    "role-management": "Role Management",
};

export function useBreadcrumb(): Breadcrumb[] {
    const location = useLocation();

    const segments = location.pathname
        .split("/")
        .filter(Boolean);

    const breadcrumbs: Breadcrumb[] = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label =
            ROUTE_LABELS[segment] ??
            segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

        return {
            label,
            href,
            isLast: index === segments.length - 1,
        };
    });

    return [
        {
            label: "Home",
            href: "/",
            isLast: segments.length === 0,
        },
        ...breadcrumbs,
    ];
}