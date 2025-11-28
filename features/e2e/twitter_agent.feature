# language: pt
Funcionalidade: Agente do Twitter responde a menções de usuários

  Cenário: Um usuário menciona o bot e recebe uma resposta
    Dado que a API do Twitter retornará uma nova menção com o texto "Olá, bot!"
    E a API do Nation.fun responderá à mensagem "Olá, bot!" com "Olá, humano!"
    Quando o bot verificar por novas menções no Twitter
    Então a API do Twitter deverá ter sido chamada para postar a resposta "Olá, humano!"
