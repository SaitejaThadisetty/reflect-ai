// src/pages/index.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';

// Dynamically import the form to disable Server-Side Rendering for the editor
const JournalForm = dynamic(
  () => import('../components/JournalForm'),
  { ssr: false }
);

export default function Home() {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    // ... (fetchEntries function remains the same as before)
    try {
      const res = await fetch('/api/journal');
      if (!res.ok) {
        console.error("API call failed with status:", res.status);
        setEntries([]);
        return;
      }
      const responseData = await res.json();
      if (Array.isArray(responseData)) {
        setEntries(responseData);
      } else {
        console.error("API did not return an array:", responseData);
        setEntries([]);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      setEntries([]);
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
                    {/* Safely render the sanitized HTML content */}
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.content) }} 
                    />
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