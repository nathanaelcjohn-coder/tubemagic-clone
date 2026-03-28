import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel." }, { status: 500 });
    }

    let transcript = "";
    // 1. ATTEMPT TO SCRAPE TRANSCRIPT (The TubeMagic feature)
    if (youtubeUrl && youtubeUrl.trim() !== '') {
      try {
        const YoutubeTranscript = (await import('youtube-transcript')).YoutubeTranscript;
        const transcriptData = await YoutubeTranscript.fetchTranscript(youtubeUrl);
        transcript = transcriptData.map((item: any) => item.text).join(' ');
      } catch (e) {
        console.warn("Transcript fetch failed, proceeding with topic only.");
      }
    }

    // 2. THE UPDATED 2026 BETA URL (Your specific request)
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `You are an expert YouTube Scriptwriter. Your goal is to write a high-retention, viral-ready script tailored to the user's specific topic and target length (${targetLength} minutes). 
    Use a professional structure: Engaging Hook, Value-Driven Body, and Clear Call to Action. 
    Include [0:00] timestamps and [Visual Cues] for the editor.`;

    const userPrompt = transcript 
      ? `INSPIRATION STYLE: Match the pacing and tone of this transcript closely: ${transcript.substring(0, 5000)}\n\nUSER TOPIC: ${topic}`
      : `TOPIC: ${topic}`;

    const promptBody = {
      contents: [{
        parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }]
      }]
    };

    const response = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptBody)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Google API Error: ${data.error?.message || 'Check model availability'}` 
      }, { status: response.status });
    }

    const script = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ script });

  } catch (error: any) {
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}