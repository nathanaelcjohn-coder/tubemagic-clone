'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { Film, Loader2, Sparkles, Copy, Check, Clock, Video, Zap, Layers, Play, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [targetLength, setTargetLength] = useState('10');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [videoStatus, setVideoStatus] = useState('idle'); // idle, generating, ready
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) { setError('Please describe your video'); return; }
    setLoading(true); setError(''); setGeneratedScript(''); setVideoStatus('idle');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl, topic, targetLength }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setGeneratedScript(data.script);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const startVideoEngine = () => {
    setVideoLoading(true);
    setTimeout(() => {
      setVideoStatus('ready');
      setVideoLoading(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Premium Navbar */}
      <nav className="border-b border-white/5 p-4 sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tighter">ScriptAI Studio</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-screen-2xl mx-auto p-6 grid lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        
        {/* Input Controls (3 cols) */}
        <aside className="lg:col-span-3 space-y-4 overflow-auto pr-2 custom-scrollbar">
          <Card className="bg-[#111] border-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Settings className="w-4 h-4" /> PROJECT SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase">Style Reference</label>
                <Input placeholder="YouTube URL..." className="bg-black border-white/10 text-sm" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase">Script Topic</label>
                <Textarea placeholder="Describe the scene..." className="bg-black border-white/10 h-32 text-sm" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 font-bold">
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Run AI Writer
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Script Editor (5 cols) */}
        <main className="lg:col-span-5 flex flex-col gap-4">
          <Card className="bg-[#111] border-white/5 flex-1 flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/5 flex flex-row justify-between items-center">
              <CardTitle className="text-sm text-gray-400">SCRIPT CANVAS</CardTitle>
              {generatedScript && (
                <Button onClick={() => navigator.clipboard.writeText(generatedScript)} className="p-1 hover:bg-white/10 rounded transition">
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed text-gray-400">
              {loading ? (
                <div className="h-full flex items-center justify-center opacity-50">Writing script...</div>
              ) : generatedScript ? (
                <pre className="whitespace-pre-wrap">{generatedScript}</pre>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 italic">Awaiting AI Generation</div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* AI Video Editor (4 cols) */}
        <section className="lg:col-span-4 space-y-4">
          <Card className="bg-[#111] border-white/5 h-full flex flex-col">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> VEO VIDEO ENGINE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col h-full">
              {generatedScript ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg border border-white/10 flex items-center justify-center relative group overflow-hidden">
                    {videoStatus === 'ready' ? (
                      <div className="absolute inset-0 bg-purple-900/20 flex flex-col items-center justify-center">
                         <Play className="w-12 h-12 text-white fill-white mb-2" />
                         <span className="text-xs text-purple-300 font-bold">READY TO EXPORT</span>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <Video className="w-10 h-10 mx-auto mb-2 text-gray-800" />
                        <p className="text-xs text-gray-600">Sync script visual cues to generate footage</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={startVideoEngine} 
                    disabled={videoLoading || videoStatus === 'ready'}
                    className="w-full bg-purple-600 hover:bg-purple-500 font-bold h-12"
                  >
                    {videoLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                    {videoStatus === 'ready' ? 'Visuals Generated' : 'Generate AI B-Roll'}
                  </Button>

                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-600 uppercase tracking-widest">Scene Queue</label>
                    <div className="space-y-1">
                      <div className="p-2 bg-white/5 rounded text-[10px] flex justify-between border border-white/5">
                        <span>[Scene 1] Intro Hook Clip</span>
                        <span className="text-green-500 text-[8px]">PROMPT READY</span>
                      </div>
                      <div className="p-2 bg-white/5 rounded text-[10px] flex justify-between border border-white/5">
                        <span>[Scene 2] Topic Visual B-Roll</span>
                        <span className="text-green-500 text-[8px]">PROMPT READY</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center opacity-20 grayscale">
                  <p className="text-xs uppercase tracking-tighter">Generate script first to unlock video suite</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}