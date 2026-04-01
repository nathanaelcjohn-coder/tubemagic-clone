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
  // 1. Initialize Supabase at the top of your file
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ... inside your POST function, after the AI generates the 'text' variable ...

// 2. Push the data to your table
const { data, error } = await supabase
  .from('your_table_name') // Change this to your actual Supabase table name!
  .insert([
    { 
      topic: topic, 
      script: text, 
      created_at: new Date().toISOString() 
    }
  ]);

if (error) console.error("Supabase Save Error:", error);
}