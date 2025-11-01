// pages/api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch('https://open.service.crestal.network/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The API key is now securely handled on the server-side
        'Authorization': `Bearer ${process.env.TOKEN_NATION}`
      },
      body: JSON.stringify({
        model: 'intentkit-001',
        messages: [{
          role: 'user',
          content: message
        }]
      })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Crestal API Error:', errorData);
        return res.status(response.status).json({ error: 'Failed to fetch from Crestal API' });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
