'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Loader as Loader2, Sparkles } from 'lucide-react';
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

  const handleGenerate = async () => {
    if (!youtubeUrl || !topic) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedScript('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeUrl,
          topic,
          targetLength,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate script');
      }

      setGeneratedScript(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">ScriptAI</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Generate Your Script</h1>
          <p className="text-gray-400">
            Create viral YouTube scripts powered by AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Script Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your script generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url" className="text-white">
                    Inspiration YouTube URL
                  </Label>
                  <Input
                    id="youtube-url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <p className="text-sm text-gray-500">
                    Paste a YouTube video URL to analyze its style
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-white">
                    What is your video about?
                  </Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe your video topic in detail..."
                    rows={5}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                  />
                  <p className="text-sm text-gray-500">
                    Provide detailed information about your video content
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-length" className="text-white">
                    Target Length
                  </Label>
                  <Select value={targetLength} onValueChange={setTargetLength}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Choose your desired video length
                  </p>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !youtubeUrl || !topic}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Script
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Generated Script</CardTitle>
                <CardDescription className="text-gray-400">
                  Your AI-generated script will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Analyzing video and generating script...</p>
                    </div>
                  </div>
                ) : generatedScript ? (
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-sans">
                        {generatedScript}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-20 text-gray-500">
                    <div className="text-center">
                      <Film className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>Fill in the form and click Generate to see your script here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
