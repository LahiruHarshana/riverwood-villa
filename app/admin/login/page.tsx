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
import { Eye, EyeOff } from "lucide-react";

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
      const idToken = await userCredential.user.getIdToken();
      await setSessionCookie(idToken);
      router.push("/admin");
    } catch {
      setError("Invalid credentials");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-4 md:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#151512]/10 bg-[#fffdf7]/70 shadow-[0_30px_90px_rgba(70,81,67,0.18)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#151512] p-10 text-[#fffdf7] md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(132,147,131,0.42),transparent_28rem),radial-gradient(circle_at_80%_80%,rgba(178,123,66,0.28),transparent_24rem)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 font-serif text-3xl">
                R
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c7c9bd]">Riverwood Villa</p>
              <h1 className="mt-4 max-w-md font-serif text-6xl font-medium leading-[0.9] tracking-[-0.06em]">
                Quiet control for a slower stay.
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#d8d6cc]">
              Manage rooms, bookings, and guest conversations from a private panel that now carries the same mood as the villa website.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="mb-8">
            <span className="admin-page-kicker">Admin access</span>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.05em] text-[#151512]">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-[#6f746a]">Sign in to manage your property.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#465143]">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="admin-input"
                placeholder="admin@riverwood.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#465143]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="admin-input pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#6f746a] transition-colors hover:bg-[#e8ebe3] hover:text-[#151512]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-primary-button w-full disabled:opacity-50"
            >
              {isSubmitting ? <><Spinner size="sm" /> Signing in...</> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
