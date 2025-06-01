import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoUrl = body.videoUrl;

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing videoUrl" },
        { status: 400 }
      );
    }

    const apiKey = GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not defined in environment variables.");
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create model instance
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });

    const result = await model.generateContent([
      { text: `
Analyze this YouTube video

1. Summarize it in 5 sentences.
2. Extract chapter breakdowns with approximate timestamps and titles.
3. Output in the following format:

Summary:
<your summary>

Chapters:
- 0:00 Title 1
- 2:35 Title 2
- 5:10 Title 3
` },
      {
        fileData: {
          fileUri: videoUrl,
          mimeType: "video/mp4", 
        },
      },
    ]);

    // const textOutput =
    //   result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    //   "No content returned.";
    const response = result.response;
    // const textOutput = 'Its a video about baseball'

    return NextResponse.json(
      {
        summary: response.text(),
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
