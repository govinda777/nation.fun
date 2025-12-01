import type { Metadata } from 'next';
import DashboardLayout from '@/components/DashboardLayout'; // Alias

export const metadata: Metadata = {
  title: 'Painel de Controle - Nation.fun',
  description: 'Gerencie seus agentes e ativos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
