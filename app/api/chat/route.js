import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: message,
        },
        temperature: 0.3, // Adjust for more formal responses
        maxOutputTokens: 256,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Gemini API Error:", data.error || data);
      return NextResponse.json({ error: data.error?.message || "Failed to get a response from Gemini." }, { status: 500 });
    }

    if (!data || !data.candidates || data.candidates.length === 0) {
      return NextResponse.json({ error: "No generated text found in the response." }, { status: 500 });
    }

    const reply = data.candidates[0].output;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API Chat Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
