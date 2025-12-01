'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import ChatWidget from '@/components/ChatWidget';
import OnRamp from '@/components/OnRamp';
import Header from '@/components/Header';

export default function Hotsite() {
  const { login } = usePrivy();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div>
      {/* O <Head> é gerenciado pelo app/layout.tsx */}
      <Header />

      <main>
        <section style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>Crie Agentes de IA para o seu Negócio em Minutos</h2>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>
            Automatize seu atendimento, vendas e processos com a simplicidade e segurança da tecnologia Web3. Sem necessidade de cartão de crédito para começar.
          </p>
          <button onClick={login} className="btn">Crie agora o seu agente</button>
        </section>

        {/* ... (Todo o resto do conteúdo original do Hotsite é colado aqui) ... */}

        <section style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Como Funciona?</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '280px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                <h3>1. Crie sua conta segura</h3>
                <p>Use sua conta social para um login rápido e seguro, sem senhas complicadas.</p>
              </div>
              <div style={{ flex: '1', minWidth: '280px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                <h3>2. Adquira seu Passe</h3>
                <p>Adicione créditos à sua carteira digital para comprar o Nation Pass e ter acesso total.</p>
              </div>
              <div style={{ flex: '1', minWidth: '280px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                <h3>3. Lance seu Agente</h3>
                <p>Escolha um template pronto, configure e comece a automatizar em minutos.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 20px', backgroundColor: '#fff', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Compre NATO Tokens</h2>
            <OnRamp />
          </div>
        </section>

        <section style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#007bff' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', color: '#fff', marginBottom: '20px' }}>Pronto para automatizar seu negócio?</h2>
            <button onClick={login} className="btn" style={{ backgroundColor: '#fff', color: '#007bff' }}>Crie agora o seu agente</button>
          </div>
        </section>
      </main>

      <div className="chat-flutuante">
        <button onClick={toggleChat} className="chat-botao">
          Chat
        </button>
        {isChatOpen && <ChatWidget />}
      </div>
    </div>
  );
}
