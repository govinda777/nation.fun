import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ message: 'Missing messages in request body' });
  }

  try {
    const response = await fetch('https://open.service.crestal.network/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOKEN_NATION}`,
      },
      body: JSON.stringify({
        model: 'intentkit-001',
        messages,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
