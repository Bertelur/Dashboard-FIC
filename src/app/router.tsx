import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { RequireRole } from "@/features/auth/RequireRole";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { LoginPage } from "@/features/auth/LoginPage";
import { HomePage } from "@/features/home/HomePage";
import { ProductsPage } from "@/features/products/ProductsPage";
import { CreateProductPage } from "@/features/products/CreateProductPage";
import { EditProductPage } from "@/features/products/EditProductPage";
import { CreateUnitPage } from "@/features/units/CreateUnitPage";
import { OrdersPage } from "@/features/orders/OrdersPage";
import { ReportsPage } from "@/features/reports/ReportsPage";
import { InvoicesPage } from "@/features/invoices/InvoicesPage";
import { RoleManagementPage } from "@/features/role-management/RoleManagementPage";

export const router = createBrowserRouter([
    { path: "/auth/login", element: <LoginPage /> },

    {
        element: <RequireAuth />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { path: "/", element: <HomePage /> },
                    { path: "/products", element: <ProductsPage /> },
                    { path: "/products/new", element: <CreateProductPage /> },
                    { path: "/products/:id/edit", element: <EditProductPage /> },
                    { path: "/products/units/new", element: <CreateUnitPage /> },
                    { path: "/orders", element: <OrdersPage /> },
                    { path: "/reports", element: <ReportsPage /> },
                    { path: "/invoices", element: <InvoicesPage /> },
                    {
                        element: <RequireRole allowed={["super-admin"]} />,
                        children: [{ path: "/role-management", element: <RoleManagementPage /> }],
                    },
                ],
            },
        ],
    },
]);
