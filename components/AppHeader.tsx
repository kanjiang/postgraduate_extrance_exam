"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AppHeader() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="app-header">
      <Link href="/" className="brand-link">
        工程管理备考
      </Link>
      <nav className="app-nav">
        <Link href="/nav" className="nav-link-strong">
          导航
        </Link>
        <Link href="/today" className="nav-link-desktop">
          今日
        </Link>
        <Link href="/schedule" className="nav-link-desktop">
          课表
        </Link>
        <Link href="/search" className="nav-link-desktop">
          搜索
        </Link>
        <button type="button" className="btn-text" onClick={logout}>
          退出
        </button>
      </nav>
    </header>
  );
}
