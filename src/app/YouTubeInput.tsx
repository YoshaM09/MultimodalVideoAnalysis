"use client";
// import { Logger } from "@/utils/logger";
import { useState, useEffect } from "react";
// import { VideoService } from "@/app/lib/services/video";
import { VertexAI, GenerateContentRequest, Part } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
// import { getAuthenticatedSupabaseClient } from "@/app/lib/supabase";

// const logger = new Logger("VideoAction");

export function YouTubeInput() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/video-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();
      setVideoData(data.summary);
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="youtube-url"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            YouTube Video URL
          </label>
          <input
            id="youtube-url"
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="button"
          disabled={!videoUrl.trim() || loading}
          onClick={handleAnalyze}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          {loading ? "Analyzing..." : "Analyze Video"}
        </button>

        {videoData && (
          <div className="mt-4 p-4 bg-zinc-800 rounded text-white">
            <h2 className="text-lg font-semibold mb-2">Video Summary</h2>
            <pre className="whitespace-pre-wrap">{videoData}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

