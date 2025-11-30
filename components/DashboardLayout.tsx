'use client';

import Link from 'next/link';
import Header from './Header.tsx';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link href="/dashboard" className={pathname === '/dashboard' ? 'sidebar-link-active' : 'sidebar-link'}>
              Dashboard
            </Link>
            <Link href="/agents" className={pathname === '/agents' ? 'sidebar-link-active' : 'sidebar-link'}>
              Agentes
            </Link>
          </nav>
        </aside>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
