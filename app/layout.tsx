import type { Metadata } from 'next';
import '../styles/style.css';
import '../styles/WalletAssets.css';
import Providers from '@/components/Providers'; // Usando o alias de caminho configurado no tsconfig

export const metadata: Metadata = {
  title: 'nation.fun - AI Agents for a new world',
  description: 'Create, deploy, and manage autonomous AI agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
