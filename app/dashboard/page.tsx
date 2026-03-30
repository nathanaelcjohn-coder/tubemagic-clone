'use client';

import { useState } from 'react';
import { Settings, Loader2, Sparkles, Copy, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

export default function Dashboard() {
  // --- 1. THE "MEMORY" (STATE) ---
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [topic, setTopic] = useState('');
  
  const [activeView, setActiveView] = useState<'script' | 'video'>('script');
  const [isScriptFinished, setIsScriptFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');

  // --- 2. THE SIMULATION LOGIC ---
 const handleRunAIWriter = async () => {
    setIsGenerating(true);
    
    try {
      // Send the data to your new backend route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, duration, youtubeUrl })
      });
      
      const data = await response.json();
      
      // Save the real AI script and trigger the purple button
      setGeneratedScript(data.script);
      setIsScriptFinished(true);
    } catch (error) {
      console.error("Failed to generate:", error);
      setGeneratedScript("Whoops! Something went wrong generating the script.");
      setIsScriptFinished(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- 3. THE UI LAYOUT ---
  return (
    <div className="min-h-screen bg-black text-white p-6">
      
      {/* Top Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
           <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">ScriptAI Studio</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: INPUT CONTROLS --- */}
        <aside className="lg:col-span-3 space-y-4">
          <Card className="bg-[#111] border-white/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2 tracking-wider">
                <Settings className="w-4 h-4" /> PROJECT SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              
              {/* Style Reference */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Style Reference</label>
                <Input 
                  placeholder="YouTube URL..." 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-gray-500 text-sm" 
                  value={youtubeUrl} 
                  onChange={(e) => setYoutubeUrl(e.target.value)} 
                />
              </div>

              {/* Video Length (NEW) */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Video Length</label>
                <Input 
                  placeholder="e.g., 60 seconds, 10 mins..." 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-gray-500 text-sm" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                />
              </div>

              {/* Script Topic */}
              <div>
                <label className="text-xs text-gray-500 uppercase font-medium block mb-2">Script Topic</label>
                <Textarea 
                  placeholder="Describe the scene..." 
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-gray-500 h-32 text-sm" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                />
              </div>
              
              {/* Run Button */}
              <Button onClick={handleRunAIWriter} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-500 font-bold text-white">
                {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Run AI Writer
              </Button>

            </CardContent>
          </Card>
        </aside>

        {/* --- RIGHT COLUMN: THE TRAFFIC COP --- */}
        <main className="lg:col-span-9">
          
          {activeView === 'script' ? (
            
            /* VIEW 1: SCRIPT CANVAS */
            <Card className="bg-[#111] border-white/5 p-6 h-full min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Script Canvas</h2>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white"><Copy className="w-4 h-4" /></Button>
              </div>
              
              <div className="flex-1 overflow-auto text-gray-300 text-sm leading-relaxed space-y-4">
                {isScriptFinished ? (
                    <div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                      {generatedScript}
                    </div>
                      <p className="font-bold text-white">**YouTube Video Title:** STOP Wasting Time: The ONLY 5 Ways You NEED to Get Fit (Proven by Science!)</p>
                      <p className="mb-4 text-gray-400">**(Thumbnail Idea: Energetic person mid-workout, a clean infographic with "5 WAYS," and an exclamation mark.)**</p>
                      <p className="font-bold text-blue-400">**[0:00] HOOK - The Frustration & The Promise**</p>
                      <p>**(Speaker - energetic, direct, and empathetic tone)** "Are you tired of feeling overwhelmed by endless diet fads and confusing workout routines?"</p>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg">
                      <p className="text-gray-600 italic">Enter your topic and click Run AI Writer to generate a script...</p>
                    </div>
                )}
              </div>

              {/* The Pop-Up Button */}
              {isScriptFinished && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <Button onClick={() => setActiveView('video')} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 text-lg transition-all duration-300">
                    Generate Video with Veo Engine
                  </Button>
                </div>
              )}
            </Card>

          ) : (

            /* VIEW 2: VEO VIDEO ENGINE */
            <Card className="bg-[#111] border-white/5 p-6 h-full min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-400 font-bold text-sm uppercase tracking-wider">Veo Video Engine</h2>
              </div>
              
              <div className="bg-black border border-white/10 flex-1 flex flex-col items-center justify-center rounded-lg mb-6 shadow-inner">
                <Play className="w-16 h-16 text-gray-700 mb-4" />
                <p className="text-gray-500 font-bold tracking-widest uppercase">Ready to Export</p>
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