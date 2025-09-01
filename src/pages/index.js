import { useState, useEffect } from 'react';
import JournalForm from '../components/JournalForm';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [entries, setEntries] = useState([]);

  // This function is now safer and handles errors
  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journal');
      if (!res.ok) {
        // This will catch the 500 error from the API
        console.error("API call failed with status:", res.status);
        setEntries([]); // Clear entries on error
        return;
      }

      const responseData = await res.json();

      // Check if the data is an array before trying to map it
      if (Array.isArray(responseData)) {
        setEntries(responseData);
      } else {
        console.error("API did not return an array:", responseData);
        setEntries([]); // Clear entries if data is not an array
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      setEntries([]); // Clear entries on network error
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-50 to-zinc-400">
          Reflect AI
        </h1>
        <p className="text-zinc-400 mt-2">Your intelligent journaling companion.</p>
        <Link href="/dashboard" passHref>
          <Button variant="outline" className="mt-6 bg-transparent backdrop-blur-sm border-zinc-800 hover:bg-zinc-900/50 text-zinc-300">
            View Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>
      
      <main className="max-w-2xl mx-auto">
        <JournalForm onEntryCreated={fetchEntries} />
        <div className="mt-12">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Card className="mb-4 bg-zinc-900/30 border-zinc-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-zinc-200">{entry.mood}</CardTitle>
                    <CardDescription className="text-zinc-400">{new Date(entry.createdAt).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-300 whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}