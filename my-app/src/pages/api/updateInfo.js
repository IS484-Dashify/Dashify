import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const filePath = path.join(process.cwd(), 'data', 'vmInfo.json');
    console.log(filePath)

    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        console.log(err)
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
