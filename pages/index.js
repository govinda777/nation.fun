import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Nation Agent</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <div id="chat-container">
        <div id="chat-messages"></div>
        <div id="chat-input">
          <input type="text" id="message-input" placeholder="Type your message..." />
          <button id="send-button">Send</button>
          <button id="test-whatsapp-button">Test WhatsApp</button>
        </div>
      </div>
      <script src="/script.js"></script>
    </>
  );
}
