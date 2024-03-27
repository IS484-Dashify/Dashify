import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, port, ipAddress, method="GET" } = req.query; // Assuming these are passed as query params

  if (!endpoint || typeof endpoint !== 'string' || !port || typeof port !== 'string' || !ipAddress || typeof ipAddress !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid parameters' });
  }

  const url = `http://${ipAddress}:${port}/${endpoint}`;

  try {
    
    const response = await fetch(url, { method: method as string });
        
    const data = await response.json(); // assuming the server response is text
    // Forward the response from the server to the client
    res.status(200).json( data );
  } catch (error) {
    console.error("Error making request:", error);
    res.status(500).json({ error: 'Failed to execute data fetch' });
  }
}
