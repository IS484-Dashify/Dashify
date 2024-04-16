import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, port, ipAddress, method="GET", body='' } = req.query; // Assuming these are passed as query params

  if (!endpoint || typeof endpoint !== 'string' || !port || typeof port !== 'string' || !ipAddress || typeof ipAddress !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid parameters' });
  }

  const url = `http://${ipAddress}:${port}/${endpoint}`;

  const fetchOptions: RequestInit = {
    method: method as string,
  };

  if (method !== 'GET' && body) {
    if (method !== 'GET' && body) {
      fetchOptions.headers = {
        'Content-Type': 'application/json',
      };
      // Ensure the body is a stringified JSON if it's not for a GET request
      fetchOptions.body = JSON.stringify(JSON.parse(body as string));
    }
  }

  try {
    // console.log("Fetch Data Method:", method, "url:", url);
    const response = await fetch(url, fetchOptions);
        
    const data = await response.json(); // assuming the server response is text
    // Forward the response from the server to the client
    res.status(200).json( data );
  } catch (error) {
    console.error("Error making request:", error);
    res.status(500).json({ error: 'Failed to execute data fetch' });
  }
}

export const config = {
  api: {
    responseLimit: false,
  }
};