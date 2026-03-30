import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Investor Data Vault)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the AI with your secure key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, duration, youtubeUrl } = body;

    // The AI Model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, topic, targetLength } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing." }, { status: 500 });
    }

    // 1. GET THE SCRIPT FROM GEMINI
    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const promptBody = {
      contents: [{
        parts: [{
          text: `You are an expert YouTube strategist. Write a high-retention, viral script.
          Topic: ${topic}
          Length: ${targetLength} minutes
          Format: Use [0:00] timestamps and [Visual Cues].
          Tone: Engaging and professional (Tailored specifically to the user's topic).`
        }]
      }]
    };

    const aiResponse = await fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptBody)
    });

    const aiData = await aiResponse.json();
    
    if (!aiResponse.ok) {
      throw new Error(aiData.error?.message || "AI Generation failed");
    }

    const script = aiData.candidates[0].content.parts[0].text;

    // 2. SAVE TO THE VAULT (The "Acquisition Data")
    // We do this in the background so the user doesn't have to wait
    const { error: dbError } = await supabase
      .from('generated_scripts')
      .insert([
        { 
          topic: topic, 
          target_length: targetLength, 
          inspiration_url: youtubeUrl || null,
          script_content: script
        }
      ]);

    if (dbError) console.error("Database Log Failed:", dbError.message);

    return NextResponse.json({ script });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}