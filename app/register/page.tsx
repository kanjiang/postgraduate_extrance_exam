import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <h1 className="auth-brand">工程管理备考</h1>
      <p className="muted">用邮箱注册，开始整理知识点</p>
      <AuthForm mode="register" />
      <p className="auth-switch">
        已有账号？<Link href="/login">登录</Link>
      </p>
    </main>
  );
}
