import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function ProductsLayout() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Products</h1>
                    <p className="text-sm text-muted-foreground">Manage your products</p>
                </div>

                <Button asChild>
                    <Link to="/products/new">Add product</Link>
                </Button>
            </div>

            <Outlet />
        </div>
    );
}
