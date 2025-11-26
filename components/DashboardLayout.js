import Link from 'next/link';
import Header from './Header';
import { useRouter } from 'next/router';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link href="/dashboard" className={router.pathname === '/dashboard' ? 'sidebar-link-active' : 'sidebar-link'}>
              Dashboard
            </Link>
            <Link href="/agents" className={router.pathname === '/agents' ? 'sidebar-link-active' : 'sidebar-link'}>
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
