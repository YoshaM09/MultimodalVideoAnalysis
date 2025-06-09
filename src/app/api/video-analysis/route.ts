import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import { env } from "@/config/env";
import { getGeminiResponse } from "@/utils/geminiClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoUrl = body.videoUrl;
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);

    console.log("YouTubeUrl", videoUrl);
    console.log("Transcript", transcript);

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing videoUrl" },
        { status: 400 }
      );
    }

    // const apiKey = env.GOOGLE_API_KEY;
    // if (!apiKey) {
    //   throw new Error("GOOGLE_API_KEY is not defined in environment variables.");
    // }

    // // Initialize Gemini client
    // const genAI = new GoogleGenerativeAI(apiKey);
    // // Create model instance
    // const model = genAI.getGenerativeModel({
    //   model: "models/gemini-2.0-flash-lite",
    // });

    const prompt = `
          Analyze the following transcript and provide a breakdown of the main topics that are discussed in the video, 
          with timestamps for esch topic. 

          <videoTranscript>
                Transcript: ${transcript.map(t => `[${t.offset}] ${t.text}`).join("\n")}
          </videoTranscript>

          Provide your response in the following JSON format:
          {
            "topics": [
              {
                "timpstamp": "HH:MM:SS" or "MM:SS",
                "topic": "Topic name"
              }
            ]
          }
          `;
    // const result = await model.generateContent([
    //   prompt,
    //   {
    //     fileData: {
    //       fileUri: videoUrl,
    //       mimeType: "video/mp4",
    //     },
    //   },
    // ]);

    const result = await getGeminiResponse([
      {
        role: "user",
        content: prompt,
      },
    ]);

    // const textOutput =
    //   result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    //   "No content returned.";
    console.log(result);
    // const response = result;
    // console.log(response)
    // const textOutput = 'Its a video about baseball'

    return NextResponse.json(
      {
        result,
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
