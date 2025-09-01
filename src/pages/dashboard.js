import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/journal');
        if (!res.ok) {
          // Handle HTTP errors like 404 or 500
          console.error("API call failed with status:", res.status);
          setData([]); // Set to empty array on error
          return;
        }

        const responseData = await res.json();
        
        // Add this line to see what the API is actually sending
        console.log('API Response:', responseData);

        // Check if the responseData is an array before mapping
        if (Array.isArray(responseData)) {
          const chartData = responseData
            .map(entry => ({
              name: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              sentiment: entry.sentiment,
            }))
            .reverse();
          setData(chartData);
        } else {
          // If it's not an array, log an error and set data to empty
          console.error("API did not return an array:", responseData);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
        setData([]); // Also clear data on a network error
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white">
       <Link href="/" passHref>
        <Button variant="ghost" className="absolute top-4 left-4 text-zinc-400 hover:text-white">
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </Link>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-50 to-zinc-400">
          Sentiment Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">A timeline of your emotional journey.</p>
      </header>
      
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-zinc-200">Your Mood Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-96 pr-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" stroke="#a1a1aa" />
                <YAxis domain={[-1, 1]} stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(24, 24, 27, 0.8)',
                    borderColor: '#404040',
                  }}
                  labelStyle={{ color: '#d4d4d8' }}
                />
                <Line type="monotone" dataKey="sentiment" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}