import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // <-- Safely at the top!

// 1. Initialize Supabase (The Database)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Initialize Gemini (The AI Brain)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, duration, youtubeUrl, format } = body;

    // --- AI GENERATION PHASE ---
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert YouTube scriptwriter. 
    Write a highly engaging YouTube script about: "${topic}". 
    The video should be roughly ${duration} long.
    Make sure to include a catchy title, a hook, and visual cues in brackets.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // --- DATABASE SAVING PHASE ---
    // NOTE: I am assuming your table is named 'scripts'. 
    // If it is named something else, change it on the line below!
    const { error } = await supabase
      .from('scripts') 
      .insert([
        { 
          topic: topic, 
          script: text, 
          created_at: new Date().toISOString() 
        }
      ]);

    if (error) {
      console.error("Supabase Save Error:", error);
      // We log the error, but we DO NOT crash the app, so the user still gets their script!
    }

    // Send the script back to the frontend UI
    return NextResponse.json({ script: text });
    
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}