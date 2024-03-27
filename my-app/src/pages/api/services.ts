// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

interface Service {
  name: string;
  sid: number;
}

type SuccessResponse = {
  services: Service;
};

interface ErrorResponse {
  error: object;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  await fetch('http://4.231.173.235:5001/get-all-services')
  .then(response => response.json())
  .then(data => {
    console.log("data:", data)
    res.status(200).json({ services: data });
  })
  .catch(error => {
    console.log("error:", error)
    res.status(500).json({ error: error });
  })

  
}
