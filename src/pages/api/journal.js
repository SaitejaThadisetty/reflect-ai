import { PrismaClient } from '@prisma/client';
import { LanguageServiceClient } from '@google-cloud/language';

const prisma = new PrismaClient();
const languageClient = new LanguageServiceClient();

const getMood = (score) => {
  if (score >= 0.3) return 'Positive 😄';
  if (score > -0.3 && score < 0.3) return 'Neutral 😐';
  return 'Negative 😠';
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const entries = await prisma.journalEntry.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(entries);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch entries.' });
    }
  }

  if (req.method === 'POST') {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content cannot be empty.' });
    }

    try {
      const document = { content, type: 'PLAIN_TEXT' };
      const [result] = await languageClient.analyzeSentiment({ document });
      const score = result.documentSentiment.score;

      const newEntry = await prisma.journalEntry.create({
        data: {
          content,
          sentiment: score,
          mood: getMood(score),
        },
      });

      return res.status(201).json({ data: newEntry });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Failed to process and save the entry.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}