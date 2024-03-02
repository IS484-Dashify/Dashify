import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { newJson } = req.body; // Destructure the 'newJson' array from the request body
    const filePath = path.join(process.cwd(), 'data', 'serviceInfo.json');
    console.log(filePath);

    // Write only the 'newJson' array to the file
    fs.writeFile(filePath, JSON.stringify(newJson), (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Error writing file' });
      } else {
        res.status(200).json({ message: 'File updated successfully' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

