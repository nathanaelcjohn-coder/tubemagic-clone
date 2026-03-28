'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Loader2, Sparkles, Copy, Check, Clock } from 'lucide-react';
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
      if (!response.ok) throw new Error(data.error || 'Failed to generate');
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
      <nav className="border-b border-gray-800 p-4 sticky top-0 bg-gray-950/50 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Film className="text-blue-500 w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">ScriptAI</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-12 grid lg:grid-cols-2 gap-8">
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Configure Script</h1>
            <p className="text-gray-400">Set your parameters and let the AI ghostwrite for you.</p>
          </div>

          <Card className="bg-gray-900 border-gray-800 shadow-xl">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-gray-300">YouTube URL</Label>
                <Input 
                  placeholder="Paste a YouTube link to match its style..." 
                  className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Video Topic</Label>
                <Textarea 
                  placeholder="What is this video about? (Descibe what you want your video to be about.))" 
                  className="bg-gray-800 border-gray-700 text-white h-40 resize-none focus:ring-blue-500"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              {/* RESTORED: Target Length Selector */}
              <div className="space-y-2">
                <Label className="text-gray-300 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-blue-400" /> Target Length
                </Label>
                <Select value={targetLength} onValueChange={setTargetLength}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="2">2 minutes (Shorts/Intro)</SelectItem>
                    <SelectItem value="5">5 minutes (Standard)</SelectItem>
                    <SelectItem value="10">10 minutes (Deep Dive)</SelectItem>
                    <SelectItem value="15">15 minutes (Feature)</SelectItem>
                    <SelectItem value="30">30 minutes (Masterclass)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 transition-colors h-12 text-lg">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                {loading ? 'Generating Your Script...' : 'Generate Script'}
              </Button>
              {error && <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <Card className="bg-gray-900 border-gray-800 flex flex-col shadow-xl min-h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 pb-4">
            <CardTitle className="text-white">Generated Script</CardTitle>
            {generatedScript && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard} 
                className="text-white border-gray-700 hover:bg-gray-800 flex items-center gap-2"
              >
                {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Script</>}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
                <p className="text-lg">Analyzing and ghostwriting...</p>
                <p className="text-sm opacity-50 mt-2">This usually takes about 10-15 seconds.</p>
              </div>
            ) : generatedScript ? (
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm font-sans leading-relaxed">
                  {generatedScript}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4 opacity-30">
                <Film className="w-20 h-20" />
                <p className="text-xl">Your viral script will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}