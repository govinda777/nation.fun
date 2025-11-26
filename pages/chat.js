import { useRouter } from 'next/router';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ChatWidget from '../components/ChatWidget';
import Head from 'next/head';

export default function ChatPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { prompt } = router.query;

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
        <title>Chat com Agente - Nation.fun</title>
      </Head>
      <DashboardLayout>
        <h2>Chat com Agente</h2>
        <p>Inicie a conversa com o agente. Dê a ele sua missão.</p>
        <div className="chat-page-widget-container">
          <ChatWidget initialMessage={prompt} />
        </div>
      </DashboardLayout>
    </>
  );
}
