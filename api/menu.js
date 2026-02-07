// api/menu.js
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default async function handler(req, res) {
  // 1. Handle GET requests (Fetch Menu)
  if (req.method === 'GET') {
    try {
      const menuItems = await prisma.menuItem.findMany({
        orderBy: { createdAt: 'desc' } // Show newest items first
      });
      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch menu' });
    }
  } 
  
  // 2. Handle POST requests (Add Item)
  else if (req.method === 'POST') {
    try {
      const { name, price, category, img, description } = req.body;
      
      const newItem = await prisma.menuItem.create({
        data: {
          name,
          price,
          category,
          img,
          description,
        },
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add item' });
    }
  }

  // 3. Handle DELETE requests (Remove Item)
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Get ID from URL query params
      await prisma.menuItem.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } 
  
  // 4. Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
