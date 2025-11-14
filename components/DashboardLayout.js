import Link from 'next/link';
import Header from './Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link href="/dashboard" className="sidebar-link-active">
              Dashboard
            </Link>
            {/* Adicionar outros links aqui no futuro */}
          </nav>
        </aside>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
