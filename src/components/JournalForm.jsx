import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner'; // Updated import, no more useToast hook
import { Bot, Loader2 } from 'lucide-react';

export default function JournalForm({ onEntryCreated }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // The useToast hook is removed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    setIsLoading(false);

    if (res.ok) {
      setContent('');
      onEntryCreated();
      // Updated success toast call
      toast.success("Entry Saved", {
        description: "Your thoughts have been analyzed and recorded.",
      });
    } else {
      // Updated error toast call
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem saving your entry.",
      });
    }
  };

  // The returned JSX for the form remains exactly the same
  return (
    <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <Textarea
            className="h-32 bg-zinc-900/50 text-zinc-200 border-zinc-700 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-violet-500"
            placeholder="Tell me what's on your mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !content}
            className="w-full mt-4 bg-violet-600 text-white hover:bg-violet-700 disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            Analyze & Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}