'use client';

import { useState } from 'react';
import { Settings, Loader2, Sparkles, Copy, Play, Video } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

export default function Dashboard() {
  // --- 1. THE STATE ---
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('16:9'); // NEW: Aspect Ratio Tracker
  
  const [activeView, setActiveView] = useState<'script' | 'video'>('script');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // --- 2. THE SMART FORMATTER ---
  // This turns boring AI text into color-coded, readable blocks
  const formatScript = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      
      let style = "mb-2 text-gray-300"; // Default style
      
      if (line.toUpperCase().includes('[VISUAL') || line.includes('Thumbnail')) {
        style = "mb-2 text-blue-400 font-bold";
      } else if (line.toUpperCase().includes('HOST') || line.toUpperCase().includes('SPEAKER') || line.toUpperCase().includes('HOOK')) {
        style = "mb-2 text-green-400 font-bold";
      } else if (line.startsWith('**')) {
        style = "mb-2 text-white font-bold text-lg mt-4";
      }

      // Remove the asterisks and return the styled paragraph
      return <p key={i} className={style}>{line.replace(/\*\*/g, '')}</p>;
    });
  };

  // --- 3. API CALLS ---
  const handleRunAIWriter = async () => {
    setIsGeneratingScript(true);
    setGeneratedScript('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration, youtubeUrl, format })
      });
      const data = await response.json();
      setGeneratedScript(data.script);
    } catch (error) {
      setGeneratedScript("Whoops! Something went wrong generating the script.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateVideo = async () => {
    setActiveView('video');
    setIsVideoGenerating(true);
    
    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: generatedScript, format })
      });
      const data = await response.json();
      setVideoUrl(data.url);
    } catch (error) {
      console.error("Video failed:", error);
    } finally {
      setIsVideoGenerating(false);
    }
  };

  // --- 4. THE UI ---
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
           <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">ScriptAI Studio</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN --- */}
        <aside className="lg:col-span-3 space-y-4">
          <Card className="bg-[#111] border-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2 tracking-wider">
                <Settings className="w-4 h-4" /> PROJECT SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Style Reference</label>
                <Input placeholder="YouTube URL..." className="bg-zinc-900 border-white/10 text-white placeholder:text-gray-500 text-sm" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Video Length</label>
                <Input placeholder="e.g., 60 seconds, 10 mins..." className="bg-zinc-900 border-white/10 text-white placeholder:text-gray-500 text-sm" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>

              {/* NEW: Format Dropdown */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Format</label>
                <select 
                  className="w-full bg-zinc-900 border border-white/10 text-white text-sm rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-500"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="16:9">YouTube Full (1920x1080)</option>
                  <option value="9:16">Shorts / Reels (1080x1920)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Script Topic</label>
                <Textarea placeholder="Describe the scene..." className="bg-zinc-900 border-white/10 text-white placeholder:text-gray-500 h-32 text-sm" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              
              <Button onClick={handleRunAIWriter} disabled={isGeneratingScript} className="w-full bg-blue-600 hover:bg-blue-500 font-bold text-white">
                {isGeneratingScript ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Run AI Writer
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* --- RIGHT COLUMN --- */}
        <main className="lg:col-span-9">
          
          {activeView === 'script' ? (
            <Card className="bg-[#111] border-white/5 p-6 h-full min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Script Canvas</h2>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white"><Copy className="w-4 h-4" /></Button>
              </div>
              
              <div className="flex-1 overflow-auto text-sm leading-relaxed space-y-2 pb-8">
                {generatedScript ? (
                    // This calls our smart formatter!
                    <div>{formatScript(generatedScript)}</div>
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg">
                      <p className="text-gray-600 italic">Enter your topic and click Run AI Writer to generate a script...</p>
                    </div>
                )}
              </div>

              {generatedScript && (
                <div className="mt-4 pt-6 border-t border-white/10">
                  <Button onClick={handleGenerateVideo} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 text-lg transition-all duration-300">
                    <Video className="w-5 h-5 mr-2" /> Generate Video with Veo Engine
                  </Button>
                </div>
              )}
            </Card>

          ) : (
            <Card className="bg-[#111] border-white/5 p-6 h-full min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Veo Video Engine</h2>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center mb-6">
                
                {/* Dynamic Video Player Container based on Aspect Ratio */}
                <div className={`bg-black border border-white/10 flex flex-col items-center justify-center rounded-lg shadow-inner overflow-hidden relative ${format === '9:16' ? 'w-[320px] h-[568px]' : 'w-full aspect-video'}`}>
                  
                  {isVideoGenerating ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                      <p className="text-gray-400 font-medium animate-pulse">Rendering Video Engine...</p>
                    </div>
                  ) : videoUrl ? (
                    <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
                  ) : null}

                </div>
              </div>

              <Button variant="ghost" onClick={() => setActiveView('script')} className="text-gray-400 hover:text-white w-fit">
                ← Back to Script Editor
              </Button>
            </Card>
          )}

        </main>
      </div>
    </div>
  );
}