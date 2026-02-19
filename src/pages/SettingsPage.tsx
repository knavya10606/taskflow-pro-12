import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import TopNavbar from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Lock, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState((user?.user_metadata?.full_name as string) || "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "✅ Profile updated" });
    setSaving(false);
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopNavbar />

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your account preferences.</p>
        </div>

        {/* Profile */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5 card-glow animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-display font-semibold text-foreground">Profile Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-border text-foreground rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Email Address</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-secondary border-border text-muted-foreground rounded-xl opacity-60"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveName}
            disabled={saving}
            className="gradient-primary text-white rounded-xl hover:opacity-90 shadow-glow"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Security */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 card-glow animate-fade-in-up stagger-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-warning" />
            </div>
            <h3 className="font-display font-semibold text-foreground">Security</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Your account is secured with email & password authentication and JWT tokens.
          </p>
        </div>

        {/* Sign out */}
        <div className="bg-card border border-destructive/30 rounded-2xl p-6 space-y-4 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-destructive/15 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <h3 className="font-display font-semibold text-foreground">Sign Out</h3>
          </div>
          <p className="text-muted-foreground text-sm">You will be redirected to the login page.</p>
          <Button
            onClick={signOut}
            variant="destructive"
            className="rounded-xl"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
