"use client";
import { VertexAI, GenerateContentRequest, Part } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import ReactPlayer from "react-player/youtube";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Topic {
  timpstamp: string;
  topic: string;
}

interface Props {
  videoUrl: string;
  topics: Topic[];
}

export function YouTubeInput() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);

  const playerRef = useRef<ReactPlayer>(null);
  //const playerRef = useRef<YT.Player | null>(null);

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
      console.log(data.result);
      setTopics(JSON.parse(data.result).topics);
    } catch (error) {
      console.error("Error analyzing video:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseTimestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(":").map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return parseFloat(timestamp);
  };

  function seekTo(seconds: number) {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  }
  // export default function VideoWithChapters({ videoUrl, topics }: Props) {
  // const playerRef = useRef<YouTubePlayer | null>(null);

  // const videoId = new URL(videoUrl).searchParams.get("v") || "";

  // const onPlayerReady = (event: { target: YouTubePlayer }) => {
  //   playerRef.current = event.target;
  // };

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

        {/* {videoData && (
          <div className="mt-4 p-4 bg-zinc-800 rounded text-white">
            <h2 className="text-lg font-semibold mb-2">Video Summary</h2>
            <pre className="whitespace-pre-wrap">{videoData}</pre>
          </div>
        )} */}

        {videoUrl && ReactPlayer.canPlay(videoUrl) && (
          <div className="aspect-video mb-4">
            <ReactPlayer
              url={videoUrl}
              ref={playerRef}
              controls
              width="100%"
              height="100%"
            />
          </div>
        )}

        {topics.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Video Topics</h2>
            <div className="list-disc pl-5 space-y-1">
              {topics.map((item, index) => (
                <div key={index} className="flex items-start gap-3 test-sm">
                  {/* <a
                    href={`https://www.youtube.com/watch?v=${new URL(videoUrl).searchParams.get("v")}&t=${Math.floor(parseTimestampToSeconds(item.timpstamp))}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    [{item.timpstamp}]
                  </a> */}
                  <button
                    onClick={() => {
                      const seconds = parseTimestampToSeconds(item.timpstamp);
                      const player = playerRef.current;

                      if (player) {
                        player.seekTo(seconds, "seconds");

                        const internal = player.getInternalPlayer();
                        // Only YouTube player has the playVideo method
                        if (typeof internal?.playVideo === "function") {
                          internal.playVideo();
                        } else if (typeof internal?.play === "function") {
                          // For other media types
                          internal.play();
                        }
                      }
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    [{item.timpstamp}]
                  </button>
                  <span>{item.topic}</span>
                  {/* className="min-w-[60px] px-2 py-1 bg-zinc-800 rounded text-zinc-300 font-mono" */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
