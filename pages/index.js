import Head from 'next/head';
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import ChatWidget from '../components/ChatWidget';

export default function Hotsite() {
  const { login } = usePrivy();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div>
      <Head>
        <title>Nation.fun - Crie seu Agente de IA</title>
        <meta name="description" content="Crie agentes de IA para o seu negócio em minutos, de forma fácil e segura." />
      </Head>

      <header className="container" style={{ padding: '20px 0', display: 'flex', alignItems: 'center' }}>
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#007bff"/>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="40" fontFamily="Arial, sans-serif">N</text>
        </svg>
        <h1 style={{ marginLeft: '10px', fontSize: '24px' }}>Nation.fun</h1>
      </header>

      <main>
        <section style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>Crie Agentes de IA para o seu Negócio em Minutos</h2>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px' }}>
            Automatize seu atendimento, vendas e processos com a simplicidade e segurança da tecnologia Web3. Sem necessidade de cartão de crédito para começar.
          </p>
          <button onClick={login} className="btn">Crie agora o seu agente</button>
        </section>

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

        <section style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Perfeito para o seu Negócio</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '280px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <img src="https://placehold.co/300x200/007BFF/FFFFFF?text=Clínica+Organizada" alt="Exemplo de agente para clínica" style={{ maxWidth: '100%', borderRadius: '5px', marginBottom: '15px' }} />
                <h4>Atendente de Clínica</h4>
                <p>Agenda consultas, responde dúvidas e envia lembretes automaticamente.</p>
              </div>
              <div style={{ flex: '1', minWidth: '280px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <img src="https://placehold.co/300x200/17A2B8/FFFFFF?text=Projeto+de+Engenharia" alt="Exemplo de agente para engenharia" style={{ maxWidth: '100%', borderRadius: '5px', marginBottom: '15px' }} />
                <h4>Orçamentos de Engenharia</h4>
                <p>Qualifica leads, coleta requisitos e envia orçamentos iniciais 24/7.</p>
              </div>
              <div style={{ flex: '1', minWidth: '280px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <img src="https://placehold.co/300x200/28A745/FFFFFF?text=Vendas+Online" alt="Exemplo de agente para e-commerce" style={{ maxWidth: '100%', borderRadius: '5px', marginBottom: '15px' }} />
                <h4>Assistente de E-commerce</h4>
                <p>Ajuda clientes a encontrar produtos, rastrear pedidos e processar devoluções.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Por que escolher Nation.fun?</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <span style={{ fontSize: '40px' }}>⚙️</span>
                <h4>Fácil de Configurar</h4>
                <p>Crie e lance seu agente em minutos com nossos templates, sem precisar de código.</p>
              </div>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <span style={{ fontSize: '40px' }}>🛡️</span>
                <h4>Segurança Web3</h4>
                <p>Você tem total controle dos seus dados e interações, com a segurança da blockchain.</p>
              </div>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <span style={{ fontSize: '40px' }}>💰</span>
                <h4>Pague o que Usar</h4>
                <p>Modelo de custos transparente e acessível, sem taxas escondidas ou planos fixos.</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Templates Prontos para Usar</h2>
            <p>Em breve, uma galeria de templates visuais para você escolher.</p>
          </div>
        </section>

        <section style={{ padding: '60px 20px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>O que nossos clientes dizem</h2>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <p style={{ fontStyle: 'italic' }}>"O Nation.fun transformou nosso atendimento. Configuramos tudo em uma tarde e os resultados foram imediatos."</p>
              <p><strong>- João Silva, CEO de uma pequena empresa</strong></p>
            </div>
          </div>
        </section>

        <section style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Perguntas Frequentes</h2>
            <div>
              <h4>O que é Web3 e por que é mais seguro?</h4>
              <p>Web3 é a nova fase da internet, onde você tem controle total sobre seus dados. Usamos essa tecnologia para garantir que só você possa acessar e gerenciar as informações do seu agente, eliminando o risco de falhas de segurança de grandes empresas.</p>
            </div>
          </div>
        </section>

        <section style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#007bff' }}>
          <div className="container">
            <h2 style={{ fontSize: '36px', color: '#fff', marginBottom: '20px' }}>Pronto para automatizar seu negócio?</h2>
            <button onClick={login} className="btn" style={{ backgroundColor: '#fff', color: '#007bff' }}>Crie agora o seu agente</button>
          </div>
        </section>
      </main>

      <footer className="container">
        {/* Rodapé aqui */}
      </footer>

      <div className="chat-flutuante">
        <button onClick={toggleChat} className="chat-botao">
          Chat
        </button>
        {isChatOpen && <ChatWidget />}
      </div>
    </div>
  );
}
