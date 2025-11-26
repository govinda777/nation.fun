import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Head from 'next/head';
import Link from 'next/link';

const agents = [
  {
    name: 'Xperience (Blue Ocean strategy)',
    description: 'Especialista em estratégias de oceano azul para inovação de mercado.',
    skills: ['Análise de Concorrência', 'Identificação de Nichos', 'Desenvolvimento de Proposta de Valor'],
    prompt: 'Olá! Sou seu agente especialista em Blue Ocean Strategy. Qual desafio de mercado você gostaria de explorar para encontrar um novo oceano azul?',
  },
  {
    name: 'New Products',
    description: 'Agente focado na concepção e lançamento de novos produtos de sucesso.',
    skills: ['Pesquisa de Mercado', 'Prototipagem Rápida', 'Estratégia de Go-to-Market'],
    prompt: 'Olá! Sou seu agente especialista em novos produtos. Por favor, me diga qual é a sua missão para que eu possa começar a te ajudar a criar o próximo produto de sucesso.',
  },
  {
    name: 'New Services',
    description: 'Especialista na criação e implementação de serviços inovadores.',
    skills: ['Mapeamento de Jornada do Cliente', 'Design de Serviço', 'Modelo de Precificação'],
    prompt: 'Olá! Sou seu agente especialista em novos serviços. Qual tipo de serviço você está pensando em desenvolver ou melhorar?',
  },
  {
    name: 'New Integrations',
    description: 'Focado em expandir a funcionalidade através de integrações com outras plataformas.',
    skills: ['Análise de APIs', 'Desenvolvimento de Conectores', 'Automação de Processos'],
    prompt: 'Olá! Sou seu agente de integrações. Me diga quais sistemas você precisa conectar e qual o objetivo da integração.',
  },
  {
    name: 'New Skill',
    description: 'Ajuda a identificar e desenvolver novas habilidades para equipes e indivíduos.',
    skills: ['Mapeamento de Competências', 'Criação de Trilhas de Aprendizagem', 'Coaching'],
    prompt: 'Olá! Sou seu agente especialista em desenvolver novas habilidades. Que competência você ou sua equipe precisam adquirir?',
  },
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
      <Head>
        <title>Agentes - Nation.fun</title>
      </Head>
      <DashboardLayout>
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
                <tr key={agent.name}>
                  <td>{agent.name}</td>
                  <td>{agent.description}</td>
                  <td>{agent.skills.join(', ')}</td>
                  <td>
                    <Link href={`/chat?prompt=${encodeURIComponent(agent.prompt)}`} passHref>
                      <button className="btn-primary">Falar com o Agente</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </>
  );
}
