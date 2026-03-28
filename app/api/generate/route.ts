import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl, topic, targetLength } = await request.json();

    if (!youtubeUrl || !topic || !targetLength) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    let transcript;
    try {
      const YoutubeTranscript = (await import('youtube-transcript')).YoutubeTranscript;
      const transcriptData = await YoutubeTranscript.fetchTranscript(youtubeUrl);
      transcript = transcriptData.map((item: any) => item.text).join(' ');
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch YouTube transcript. Make sure the video has captions enabled.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const systemPrompt = `You are an expert YouTube scriptwriter. Analyze the provided transcript for pacing and hook structure. Write a new, highly engaging script about the user's topic using a similar framework. Include timestamps and visual cues.

The script should be formatted professionally with:
- Clear timestamps (e.g., [0:00], [0:30], [1:00])
- Visual cues in brackets (e.g., [SHOW GRAPH], [CUT TO B-ROLL])
- Engaging hooks and transitions
- A strong introduction that grabs attention
- Well-paced content segments
- A compelling call-to-action at the end

Target video length: ${targetLength} minutes`;

    const prompt = `${systemPrompt}

INSPIRATION VIDEO TRANSCRIPT:
${transcript}

USER'S VIDEO TOPIC:
${topic}

Please generate a complete, production-ready script following the style and pacing of the inspiration video.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const script = response.text();

    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate script. Please try again.' },
      { status: 500 }
    );
  }
}
