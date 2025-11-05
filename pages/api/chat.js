export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: 'Campo "messages" obrigatório' });
    }

    const token = process.env.TOKEN_NATION;

    if (!token) {
      console.error('TOKEN_NATION não configurada');
      return res.status(500).json({ error: 'Configuração inválida' });
    }

    const nationUrl = process.env.NATION_API_URL || 'https://open.service.crestal.network/v1/chat/completions';

    const response = await fetch(nationUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'intentkit-001',
        messages,
      }),
    });

    if (!response.ok) {
      console.error(`Nation API error: ${response.status}`);
      return res.status(500).json({ error: 'Erro ao processar' });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error('Erro em /api/chat:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
