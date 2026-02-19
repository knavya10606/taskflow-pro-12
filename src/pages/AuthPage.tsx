import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Zap } from "lucide-react";
import { Navigate } from "react-router-dom";

type Mode = "login" | "signup";

export default function AuthPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === "signup") {
      if (form.fullName.trim().length < 2) {
        toast({ title: "Invalid name", description: "Name must be at least 2 characters.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.fullName);
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "🎉 Account created!", description: "Check your email to confirm your account." });
      }
    } else {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(245_80%_65%_/_0.2),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(280_80%_65%_/_0.15),_transparent_60%)]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">TaskFlow Pro</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="font-display text-5xl font-bold leading-tight">
                Manage tasks
                <br />
                <span className="gradient-text">like a pro.</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                Track progress, hit deadlines, and keep your team aligned — all in one beautiful dashboard.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Real-time Tracking", icon: "📊" },
                { label: "Priority Sorting", icon: "🎯" },
                { label: "Progress Insights", icon: "📈" },
                { label: "Smart Filters", icon: "🔍" },
              ].map((f) => (
                <div key={f.label} className="glass rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-medium text-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            Built for modern teams · Secure · Fast
          </p>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">TaskFlow Pro</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold text-foreground">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "login"
                ? "Sign in to your account to continue."
                : "Create your free account today."}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-secondary rounded-xl p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground h-11 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl gradient-primary text-white font-semibold text-base shadow-glow hover:opacity-90 transition-all duration-200"
            >
              {isSubmitting ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
