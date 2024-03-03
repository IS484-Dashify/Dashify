// pages/api/serverAction.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, ipAddress } = req.query; // Assuming these are passed as query params

  if (!endpoint || typeof endpoint !== 'string' || !ipAddress || typeof ipAddress !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid parameters' });
  }

  const url = `http://${ipAddress}:3000/${endpoint}`;

  try {
    const response = await fetch(url);
    const data = await response.text(); // assuming the server response is text
    // Forward the response from the server to the client
    res.status(200).json({ message: data });
  } catch (error) {
    console.error("Error making request:", error);
    res.status(500).json({ error: 'Failed to execute server action' });
  }
}
