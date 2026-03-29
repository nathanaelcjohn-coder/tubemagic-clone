'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Film, Loader2, Sparkles, Copy, Check, Clock, Video, Zap } from 'lucide-react';
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
  const [videoLoading, setVideoLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
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
    setVideoUrl('');
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

  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    // Simulating the Veo/Video API call for the Investor Demo
    setTimeout(() => {
      setVideoUrl('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueWp6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6Znd6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaeqpIu4/giphy.gif');
      setVideoLoading(false);
    }, 5000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <nav className="border-b border-gray-800 p-4 sticky top-0 bg-gray-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <Film className="text-blue-500 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-xl">ScriptAI <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full ml-2">PRO</span></span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-12 grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-3">The Studio</h1>
            <p className="text-gray-400 text-lg">Turn ideas into production-ready scripts and visuals.</p>
          </div>

          <Card className="bg-gray-900 border-gray-800 shadow-2xl">
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-2">
                <Label className="text-gray-400 font-medium">Style Inspiration (Optional)</Label>
                <Input 
                  placeholder="URL of a video you want to mimic..." 
                  className="bg-gray-800 border-gray-700 h-12 focus:border-blue-500 transition-all"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 font-medium">What's the story?</Label>
                <Textarea 
                  placeholder="Be specific. For Flames of the Forest, mention 'earthy elegance' or 'handcrafted jewelry'..." 
                  className="bg-gray-800 border-gray-700 h-40 resize-none"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-gray-400">Length</Label>
                    <Select value={targetLength} onValueChange={setTargetLength}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="2">2 min</SelectItem>
                        <SelectItem value="5">5 min</SelectItem>
                        <SelectItem value="10">10 min</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="flex items-end">
                    <Button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-10 shadow-lg shadow-blue-900/20">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                      {loading ? 'Thinking...' : 'Generate Script'}
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 h-full flex flex-col min-h-[600px] overflow-hidden">
            <CardHeader className="border-b border-gray-800 flex flex-row justify-between items-center bg-gray-900/50">
              <CardTitle className="text-sm uppercase tracking-widest text-gray-500">Output Window</CardTitle>
              <div className="flex gap-2">
                {generatedScript && (
                  <>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-gray-700 text-gray-300">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button onClick={handleGenerateVideo} disabled={videoLoading} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      {videoLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                      Create Video
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-8">
              {videoUrl && (
                <div className="mb-8 rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10">
                   <img src={videoUrl} alt="AI Preview" className="w-full h-48 object-cover" />
                   <div className="p-3 bg-purple-900/20 text-xs text-purple-300 text-center">
                      Veo Prototype: This is a visual representation of your script hook.
                   </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-600 animate-pulse">
                  <Sparkles className="w-12 h-12 mb-4 text-blue-500" />
                  <p className="text-xl font-medium">Crafting your narrative...</p>
                </div>
              ) : generatedScript ? (
                <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-sans">{generatedScript}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-gray-700 opacity-20">
                  <Video className="w-24 h-24 mb-4" />
                  <p className="text-2xl font-bold">Awaiting Instructions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}