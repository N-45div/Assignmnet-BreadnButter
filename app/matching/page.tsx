'use client';

'use client';

import { useState, useEffect } from 'react';
import { Talent } from './types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HoverEffect } from '@/components/ui/hover-effect';

export default function MatchingPage() {
  const [brief, setBrief] = useState('');
  const [matches, setMatches] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);

  // Load state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBrief = localStorage.getItem('brief');
      const savedMatches = localStorage.getItem('matches');
      if (savedBrief) {
        setBrief(savedBrief);
      }
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
    }
  }, []);

  // Save brief to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('brief', brief);
    }
  }, [brief]);

  // Save matches to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('matches', JSON.stringify(matches));
    }
  }, [matches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brief }),
      });
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (talentId: string, liked: boolean) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ talentId, liked, brief }),
      });
      alert(`Feedback recorded for ${talentId}: ${liked ? 'Liked' : 'Disliked'}`);
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Failed to record feedback.');
    }
  };

  const items = matches.map((talent) => ({
    title: talent.name,
    description: `Experience: ${talent.experience_years} years | Budget: ${talent.budget_range} | Score: ${talent.score.toFixed(2)}`,
    link: `/talent/${talent.id}`, // Placeholder for detailed profile page
    talent: talent, // Pass the full talent object for detailed display
    handleFeedback: handleFeedback, // Pass the feedback handler
  }));

  return (
    <div className="container mx-auto py-12">
      <main className="flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          Find Your Perfect Match
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-muted-foreground text-center max-w-2xl">
          Describe your project, and our AI will find the best talent for the job.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl space-y-4">
          <Textarea
            placeholder="Enter your creative brief here... (e.g., I need a travel photographer in Goa for 3 days in November for a sustainable fashion brand. I want pastel tones and candid portraits. ₹75k max.)"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            className="min-h-[150px]"
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Searching...' : 'Find Talent'}
          </Button>
        </form>

        {matches.length > 0 && (
          <div className="mt-12 w-full">
            <h2 className="text-3xl font-bold text-center">Top Matches</h2>
            <HoverEffect items={items} />
          </div>
        )}
      </main>
    </div>
  );
}
