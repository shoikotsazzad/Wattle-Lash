import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/Container";
import { AuthForm } from "@/components/AuthForm";

export const metadata = buildMetadata(null, { title: "Log in", path: "/account/login", noindex: true });

export default function LoginPage() {
  return (
    <section className="py-14 md:py-20">
      <Container className="max-w-md">
        <p className="eyebrow text-muted">Account</p>
        <h1 className="display mt-3 mb-8 text-[38px]">Log in</h1>
        <Suspense><AuthForm mode="login" /></Suspense>
      </Container>
    </section>
  );
}
