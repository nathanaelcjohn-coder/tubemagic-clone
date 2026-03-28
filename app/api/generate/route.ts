import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, topic, targetLength } = await request.json();

    if (!topic || !targetLength) {
      return NextResponse.json({ error: 'Missing topic or length' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }

    let transcript = "";
    if (youtubeUrl && youtubeUrl.trim() !== '') {
      try {
        const YoutubeTranscript = (await import('youtube-transcript')).YoutubeTranscript;
        const transcriptData = await YoutubeTranscript.fetchTranscript(youtubeUrl);
        transcript = transcriptData.map((item: any) => item.text).join(' ');
      } catch (error) {
        // Continue without transcript if it fails
        console.warn('Transcript fetch failed, proceeding with topic only');
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // THE BULLETPROOF BRAIN: Try Flash first, then fallback to Pro if Google complains
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (e) {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    const systemPrompt = `You are an expert YouTube scriptwriter. Write a highly engaging script about the user's topic. Include timestamps like [0:00] and visual cues in brackets [CUT TO B-ROLL]. 
    Target Length: ${targetLength} minutes. 
    Topic: ${topic}`;

    const prompt = transcript 
      ? `${systemPrompt}\n\nMatch the style of this transcript: ${transcript}`
      : `${systemPrompt}\n\nWrite a viral script from scratch about this topic.`;

    // Final attempt with error handling
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const script = response.text();
      return NextResponse.json({ script });
    } catch (aiError: any) {
      // If Flash failed (the 404 you saw), try the "Old Reliable" model name
      console.log('Flash failed, trying fallback model...');
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      const fallbackResponse = await fallbackResult.response;
      return NextResponse.json({ script: fallbackResponse.text() });
    }

  } catch (error) {
    console.error('Final Error:', error);
    return NextResponse.json(
      { error: 'The AI Brain is taking a breather. Please check your API key in Vercel settings and try again.' },
      { status: 500 }
    );
  }
}