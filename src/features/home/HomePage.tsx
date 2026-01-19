import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, CartesianGrid
} from "recharts";

const lineData = [
    { name: "Mon", value: 30 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 28 },
    { name: "Thu", value: 60 },
    { name: "Fri", value: 52 },
    { name: "Sat", value: 40 },
    { name: "Sun", value: 70 },
];

const barData = [
    { name: "Q1", value: 120 },
    { name: "Q2", value: 180 },
    { name: "Q3", value: 150 },
    { name: "Q4", value: 210 },
];

export function HomePage() {
    return (
        <div className="space-y-4">
            <div className="text-xl font-semibold">Home</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                        <CardDescription>Weekly activity of the website</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quarterly Revenue</CardTitle>
                        <CardDescription>Quarterly revenue of the website</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
