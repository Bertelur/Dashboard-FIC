import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/store/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ username, password });
            navigate(from, { replace: true });
            toast.success(`Welcome back, ${username}!`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Login failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Welcome to FIC Dashboard. Please enter your credentials to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-3 w-[320px]">
                        <div className="space-y-1">
                            <div className="text-sm">Username</div>
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm">Password</div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && <div className="text-sm text-red-600">{error}</div>}

                        <Button disabled={loading} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            {loading ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="inline-flex items-center justify-center gap-2">
                                    Login
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}
