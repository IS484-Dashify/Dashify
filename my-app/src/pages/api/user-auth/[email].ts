import type { NextApiRequest, NextApiResponse } from 'next'
import { createConnection } from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: 'dashify',
        port: 3306
    });
    const { query, method } = req;
    const email = query.email;
    if(method==='GET'){
        try{           
            const [results, fields] = await db.query(
                'SELECT * FROM user where email = ?', [email]
            );

            if(results[0] === undefined){
                res.status(400).json({error: 'User not found'});
            } else {
                res.status(200).json({ results: results[0] });
            }
        } catch (error) {
            if (error.code === "ECONNREFUSED"){
                res.status(500).json({ error: 'Database connection refused' });
            }
            res.status(400).json({error: error})
        } finally {
            // Ensure the connection is closed whether or not there was an error
            if (db) {
                await db.end();
            }
        }
    } 
}