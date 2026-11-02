import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { AuthForm } from "@/components/AuthForm";

export const metadata = buildMetadata(null, { title: "Create account", path: "/account/register", noindex: true });

export default function RegisterPage() {
  return (
    <section className="py-14 md:py-20">
      <Container className="max-w-md">
        <p className="eyebrow text-muted">Account</p>
        <h1 className="display mt-3 mb-3 text-[38px]">Create account</h1>
        <p className="mb-8 text-sm text-muted">See your orders and save delivery addresses for faster checkout.</p>
        <Suspense><AuthForm mode="register" /></Suspense>
      </Container>
    </section>
  );
}
