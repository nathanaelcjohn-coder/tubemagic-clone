import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing in Vercel settings." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using the most legacy-stable model name to bypass the 404 error
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a viral YouTube strategist. Write a complete, high-retention script.
    Topic: ${topic}
    Target Length: ${targetLength} minutes
    Include [0:00] timestamps and [Visual Cues] for the editor.
    Make it engaging for a Bangalore-based marketing audience.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const script = response.text();

    return NextResponse.json({ script });

  } catch (error: any) {
    console.error('Final Debug:', error.message);
    return NextResponse.json({ 
      error: `Connection Issue: ${error.message}. Please ensure the GEMINI_API_KEY is correct in Vercel.` 
    }, { status: 500 });
  }
}