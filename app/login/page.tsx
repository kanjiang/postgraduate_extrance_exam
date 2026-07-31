import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <h1 className="auth-brand">工程管理备考</h1>
      <p className="muted">登录后同步笔记到各端</p>
      <AuthForm mode="login" />
      <p className="auth-switch">
        还没有账号？<Link href="/register">注册</Link>
      </p>
    </main>
  );
}
