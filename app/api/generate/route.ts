import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel." }, { status: 500 });
    }

    // THE DIRECT LINE: We are skipping the SDK and talking to the v1 stable endpoint
    // We'll try Gemini 2.0 Flash as shown in your dashboard
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = {
      contents: [{
        parts: [{
          text: `You are a viral YouTube strategist for ZEEK Media. Write a high-retention script.
          Topic: ${topic}
          Length: ${targetLength} minutes
          Format: Use [0:00] timestamps and [Visual Cues] for the editor.`
        }]
      }]
    };

    const response = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    });

    const data = await response.json();

    if (!response.ok) {
      // This will tell us EXACTLY why Google is saying no (e.g., location, key error)
      return NextResponse.json({ 
        error: `Google API says: ${data.error?.message || 'Unknown Error'}` 
      }, { status: response.status });
    }

    const script = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ script });

  } catch (error: any) {
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}