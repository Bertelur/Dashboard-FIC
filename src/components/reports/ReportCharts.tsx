import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";

export function ReportCharts(props: {
    salesBarData: { name: string; salesAmount: number }[];
    qtyBarData: { name: string; quantity: number }[];
    mixScatterData: { name: string; salesAmount: number; quantity: number; ordersCount: number }[];
}) {
    const { salesBarData, qtyBarData, mixScatterData } = props;

    return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Top Items by Sales</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesBarData}>
                            <XAxis dataKey="name" hide />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="salesAmount" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Top Items by Quantity</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={qtyBarData}>
                            <XAxis dataKey="name" hide />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="quantity" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-base">Sales vs Quantity (Bubble = Orders)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <XAxis type="number" dataKey="quantity" name="Quantity" />
                            <YAxis type="number" dataKey="salesAmount" name="Sales" />
                            <ZAxis type="number" dataKey="ordersCount" range={[60, 300]} name="Orders" />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Scatter data={mixScatterData} />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
