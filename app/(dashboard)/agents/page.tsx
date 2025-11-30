'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation'; // Importação atualizada
import { useEffect } from 'react';
import AgentRow from '@/components/AgentRow'; // Alias

// Os dados mockados podem ficar aqui ou ser movidos para um arquivo separado
const agents = [
  {
    name: 'Xperience (Blue Ocean strategy)',
    description: 'Especialista em estratégias de oceano azul para inovação de mercado.',
    skills: ['Análise de Concorrência', 'Identificação de Nichos', 'Desenvolvimento de Proposta de Valor'],
    prompt: 'Olá! Sou seu agente especialista em Blue Ocean Strategy. Qual desafio de mercado você gostaria de explorar para encontrar um novo oceano azul?',
  },
  // ... (outros agentes)
];

export default function AgentsPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return <div className="loading-container">Carregando...</div>;
  }

  return (
    <>
      {/* O Head é tratado pelo layout do grupo */}
      <h2>Prove nossos agentes</h2>
      <p>Aqui você pode experimentar agentes especializados em diversas áreas para ver o poder da nossa plataforma.</p>

      <div className="agents-table-container">
        <table className="agents-table">
          <thead>
            <tr>
              <th>Agente</th>
              <th>Descrição</th>
              <th>Skills</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <AgentRow key={agent.name} agent={agent} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
