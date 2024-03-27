import type { NextApiRequest, NextApiResponse } from 'next'
import { createConnection } from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const db = await createConnection({
    //     host: process.env.MYSQL_HOST,
    //     user: process.env.MYSQL_USER,
    //     password: process.env.MYSQL_PASSWORD,
    //     database: 'dashify',
    //     port: Number(process.env.MYSQL_PORT)
    // });
    const { query, method } = req;
    const email = query.email;
    if(method==='GET'){
        try{           
            const data = await fetch(`http://4.231.173.235:5010/get-user/${email}`);
            const userResults = await data.json();
            const user = userResults.results
            if(Object.keys(user).length === 0){
                res.status(400).json({error: 'User not found'});
            } else {
                res.status(200).json({user : user, message : "User found"});
            }
        } catch (error: any) {
            if (error.code === "ECONNREFUSED"){
                res.status(500).json({ error: 'Database connection refused' });
            }
            res.status(400).json({error: error})
        } 
        // finally {
        //     // Ensure the connection is closed whether or not there was an error
        //     if (db) {
        //         await db.end();
        //     }
        // }
    } 
}