import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the AI with your secure key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, duration, youtubeUrl } = body;

    // The AI Model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // The System Prompt (Telling the AI how to act)
    const prompt = `You are an expert YouTube scriptwriter. 
    Write a highly engaging YouTube script about: "${topic}". 
    The video should be roughly ${duration} long.
    Make sure to include a catchy title, a hook, and visual cues in brackets.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ script: text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}