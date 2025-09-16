// src/components/JournalForm.jsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Bot, Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

export default function JournalForm({ onEntryCreated }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success("Entry Saved", {
        description: "Your thoughts have been analyzed and recorded.",
      });
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem saving your entry.",
      });
    }
  };

  return (
    <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-xl">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <RichTextEditor 
            content={content} 
            onUpdate={setContent}
          />
          <Button
            type="submit"
            disabled={isLoading || content === '<p></p>' || !content}
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