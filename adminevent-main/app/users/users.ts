// import dbConnect from '@/lib/db';
// import User from '@/lib/models/User';

// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect(); // Connect to the shared database

//   if (req.method === 'GET') {
//     try {
//       const users = await User.find({});
//       return res.status(200).json(users);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to fetch users' });
//     }
//   }

//   res.status(405).end(); 
// }
