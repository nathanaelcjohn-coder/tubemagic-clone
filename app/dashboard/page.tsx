'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [targetLength, setTargetLength] = useState('10');
  const [loading, setLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please describe what your video is about');
      return;
    }
    setLoading(true);
    setError('');
    setGeneratedScript('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl, topic, targetLength }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setGeneratedScript(data.script);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Film className="text-blue-500" />
            <span className="font-bold text-xl">ScriptAI</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Configure Script</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-400">Inspiration URL (Optional)</Label>
                <Input 
                  placeholder="Paste YouTube link here..." 
                  className="bg-gray-800 border-gray-700 text-white"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-gray-400">Video Topic</Label>
                <Textarea 
                  placeholder="What is this video about?" 
                  className="bg-gray-800 border-gray-700 text-white h-32"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-600">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                Generate Script
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800 relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Generated Script</CardTitle>
            {generatedScript && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-white border-gray-700 hover:bg-gray-800">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center py-20 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p>Analyzing and writing...</p>
              </div>
            ) : generatedScript ? (
              <pre className="whitespace-pre-wrap text-gray-300 text-sm font-sans">{generatedScript}</pre>
            ) : (
              <p className="text-gray-600 text-center py-20">Your script will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}