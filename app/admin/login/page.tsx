"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setSessionCookie } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowRight, BadgeCheck, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      try {
        const idToken = await userCredential.user.getIdToken();
        await setSessionCookie(idToken);
        router.push("/admin");
      } catch (sessionError) {
        console.error("Session creation error:", sessionError);
        setError("Login succeeded, but failed to create a secure session. Please check server logs or configuration.");
        setIsSubmitting(false);
      }
    } catch {
      setError("Invalid email or password");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-orb is-left" />
      <div className="admin-login-orb is-right" />

      <div className="admin-login-card">
        {/* Left - Brand Panel */}
        <div className="admin-login-brand-panel">
          <div className="admin-login-brand-glow" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <div className="admin-login-brand-topline">
                <div className="admin-login-logo">R</div>
                <span>Riverwood Villa</span>
              </div>

              <div className="mt-12">
                <span className="admin-login-pill"><Sparkles className="h-3.5 w-3.5" /> Private operations</span>
                <h1 className="admin-login-headline">Command every stay with calm precision.</h1>
                <p className="admin-login-copy">
                  Secure access for managing reservations, rooms, and guest communication from a focused modern workspace.
                </p>
              </div>
            </div>

            <div className="admin-login-insights">
              <div>
                <BadgeCheck className="h-4 w-4" />
                <span>Live room inventory</span>
              </div>
              <div>
                <ShieldCheck className="h-4 w-4" />
                <span>Protected admin access</span>
              </div>
              <div>
                <KeyRound className="h-4 w-4" />
                <span>Session secured by Firebase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="admin-login-form-panel">
          <div className="admin-login-mobile-brand">
            <div className="admin-login-logo">R</div>
            <div>
              <p>Riverwood Villa</p>
              <span>Admin Panel</span>
            </div>
          </div>

          <div className="mb-8">
            <span className="admin-page-kicker">Welcome back</span>
            <h1 className="admin-login-form-title">Sign in to your account</h1>
            <p className="admin-login-form-copy">
              Enter your credentials to access the admin panel.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">!</div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="admin-login-field">
              <label>Email</label>
              <div className="relative">
                <Mail className="admin-login-input-icon" />
                <input
                  type="email"
                  {...register("email")}
                  className="admin-input admin-login-input !pl-11 transition-all duration-300 hover:border-emerald-400 focus:!border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="admin@riverwood.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-600">{errors.email.message}</p>}
            </div>

            <div className="admin-login-field">
              <label>Password</label>
              <div className="relative">
                <Lock className="admin-login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="admin-input admin-login-input !pl-11 !pr-12 transition-all duration-300 hover:border-emerald-400 focus:!border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="admin-login-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-medium text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-primary-button admin-login-submit w-full disabled:opacity-40"
            >
              {isSubmitting ? <><Spinner size="sm" /> Signing in...</> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="admin-login-footnote">
            <ShieldCheck className="h-4 w-4" />
            <span>Access is restricted to authorized villa administrators.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
