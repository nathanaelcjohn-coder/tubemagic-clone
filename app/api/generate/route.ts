import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Key Missing: Please check Vercel settings." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // UPDATED FOR 2026: Using the Gemini 2 Flash model from your dashboard
    const model = genAI.getGenerativeModel({ model: "gemini-2-flash" });

    const prompt = `You are a viral YouTube strategist for ZEEK Media. Write a production-ready script.
    Topic: ${topic}
    Target Length: ${targetLength} minutes
    Include [0:00] timestamps and specific [Visual Cues] for the editor.
    Structure: Compelling Hook -> Value-Packed Middle -> Call to Action.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const script = response.text();

    return NextResponse.json({ script });

  } catch (error: any) {
    console.error('Gemini 2 Error:', error.message);
    return NextResponse.json({ 
      error: `Gemini 2 Connection Error: ${error.message}.` 
    }, { status: 500 });
  }
}