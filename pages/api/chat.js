// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { messages } = req.body;
    const narionApiUrl = process.env.NARION_API_URL;
    const tokenNation = process.env.TOKEN_NATION;

    if (!narionApiUrl || !tokenNation) {
      console.error('Missing environment variables');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const response = await fetch(narionApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenNation}`,
      },
      body: JSON.stringify({
        model: 'intentkit-001',
        messages,
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying chat request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
