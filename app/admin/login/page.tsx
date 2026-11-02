import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Log in" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-espresso px-4 py-16">
      <div className="w-full max-w-sm bg-blush p-8">
        <p className="display text-center text-3xl tracking-[0.06em]">Wattle &amp; Lash</p>
        <p className="eyebrow mt-1 mb-8 text-center text-[10px] text-mauve">Admin portal</p>
        <Suspense><AuthForm mode="login" admin /></Suspense>
      </div>
    </main>
  );
}
