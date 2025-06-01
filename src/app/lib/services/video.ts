// import { supabase, getAuthenticatedSupabaseClient } from "../supabase";
// import { VideoMetadata, VideoWithStats } from "@/app/types/video";
// import { Logger } from "@/app/utils/logger";

// const logger = new Logger("VideoService");

// interface DatabaseVideo {
//   id: string;
//   url: string;
//   caption: string;
//   user_id: string;
//   created_at: string;
//   transcription: string | null;
//   tags: string[] | null;
//   video_length: string | null;
//   video_size: number;
//   summary: string | null;
//   metadata: Record<string, unknown> | null;
//   embeddings: number[] | null;
// }

// export class VideoService {
//   static async createVideo(
//     metadata: Omit<VideoMetadata, "id" | "createdAt">
//   ): Promise<VideoMetadata> {
//     try {
//       logger.info("Creating video metadata", { url: metadata.url });

//       const client = await getAuthenticatedSupabaseClient();

//       // First insert the data
//       const { error: insertError } = await client.from("videos").insert({
//         url: metadata.url,
//         caption: metadata.caption,
//         user_id: metadata.userId,
//         video_size: metadata.videoSize,
//         transcription: metadata.transcription,
//         tags: metadata.tags,
//         video_length: metadata.videoLength,
//         summary: metadata.summary,
//         metadata: metadata.metadata,
//         embeddings: metadata.embeddings,
//       });

//       if (insertError) throw insertError;

//       // Then fetch the inserted row
//       const { data, error } = await client
//         .from("videos")
//         .select()
//         .eq("url", metadata.url)
//         .eq("user_id", metadata.userId)
//         .order("created_at", { ascending: false })
//         .limit(1)
//         .single();

//       if (error) throw error;

//       // Convert snake_case to camelCase
//       return {
//         id: data.id,
//         url: data.url,
//         caption: data.caption,
//         userId: data.user_id,
//         createdAt: data.created_at,
//         transcription: data.transcription,
//         tags: data.tags,
//         videoLength: data.video_length,
//         videoSize: data.video_size,
//         summary: data.summary,
//         metadata: data.metadata,
//         embeddings: data.embeddings,
//       };
//     } catch (error) {
//       logger.error("Failed to create video metadata", { error });
//       throw error;
//     }
//   }

//   static async getVideo(id: string): Promise<VideoMetadata | null> {
//     try {
//       logger.info("Fetching video metadata", { id });

//       const { data, error } = await supabase
//         .from("videos")
//         .select()
//         .eq("id", id)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") return null; // not found
//         throw error;
//       }

//       if (!data) return null;

//       return {
//         id: data.id,
//         url: data.url,
//         caption: data.caption,
//         userId: data.user_id,
//         createdAt: data.created_at,
//         transcription: data.transcription,
//         tags: data.tags,
//         videoLength: data.video_length,
//         videoSize: data.video_size,
//         summary: data.summary,
//         metadata: data.metadata,
//         embeddings: data.embeddings,
//       };
//     } catch (error) {
//       logger.error("Failed to fetch video metadata", { error });
//       throw error;
//     }
//   }

//   static async updateVideo(
//     id: string,
//     metadata: Partial<Omit<VideoMetadata, "id" | "createdAt" | "userId">>
//   ): Promise<VideoMetadata> {
//     try {
//       logger.info("Updating video metadata", { id });

//       const client = await getAuthenticatedSupabaseClient();

//       // First update the data
//       const { error: updateError } = await client
//         .from("videos")
//         .update({
//           caption: metadata.caption,
//           transcription: metadata.transcription,
//           tags: metadata.tags,
//           video_length: metadata.videoLength,
//           summary: metadata.summary,
//           metadata: metadata.metadata,
//           embeddings: metadata.embeddings,
//         })
//         .eq("id", id);

//       if (updateError) throw updateError;

//       // Then fetch the updated row
//       const { data, error } = await client
//         .from("videos")
//         .select()
//         .eq("id", id)
//         .single();

//       if (error) throw error;
//       if (!data) throw new Error("Video not found after update");

//       return {
//         id: data.id,
//         url: data.url,
//         caption: data.caption,
//         userId: data.user_id,
//         createdAt: data.created_at,
//         transcription: data.transcription,
//         tags: data.tags,
//         videoLength: data.video_length,
//         videoSize: data.video_size,
//         summary: data.summary,
//         metadata: data.metadata,
//         embeddings: data.embeddings,
//       };
//     } catch (error) {
//       logger.error("Failed to update video metadata", { error });
//       throw error;
//     }
//   }

//   static async deleteVideo(id: string): Promise<void> {
//     try {
//       logger.info("Deleting video metadata", { id });

//       const { error } = await supabase.from("videos").delete().eq("id", id);

//       if (error) throw error;
//     } catch (error) {
//       logger.error("Failed to delete video metadata", { error });
//       throw error;
//     }
//   }

//   static async listUserVideos(userId: string): Promise<VideoMetadata[]> {
//     try {
//       logger.info("Listing user videos", { userId });

//       const { data, error } = await supabase
//         .from("videos")
//         .select()
//         .eq("user_id", userId)
//         .order("created_at", { ascending: false });

//       if (error) throw error;

//       return data.map(video => ({
//         id: video.id,
//         url: video.url,
//         caption: video.caption,
//         userId: video.user_id,
//         createdAt: video.created_at,
//         transcription: video.transcription,
//         tags: video.tags,
//         videoLength: video.video_length,
//         videoSize: video.video_size,
//         summary: video.summary,
//         metadata: video.metadata,
//         embeddings: video.embeddings,
//       }));
//     } catch (error) {
//       logger.error("Failed to list user videos", { error });
//       throw error;
//     }
//   }

//   static async listAllVideos(): Promise<VideoMetadata[]> {
//     try {
//       //logger.info("Listing all videos");

//       const { data, error } = await supabase
//         .from("videos")
//         .select()
//         .order("created_at", { ascending: false });

//       if (error) throw error;

//       // Get unique user IDs from videos
//       const userIds = Array.from(new Set(data.map(video => video.user_id)));

//       // Fetch user info for all users in one query
//       const { data: users, error: usersError } = await supabase
//         .from("users")
//         .select("id, username, avatar_url")
//         .in("id", userIds);

//       if (usersError) throw usersError;

//       // Create a map of user info for quick lookup
//       const userMap = new Map(users.map(user => [user.id, user]));

//       return data.map((video: DatabaseVideo) => {
//         const user = userMap.get(video.user_id);
//         return {
//           id: video.id,
//           url: video.url,
//           caption: video.caption,
//           userId: video.user_id,
//           createdAt: video.created_at,
//           transcription: video.transcription || undefined,
//           tags: video.tags || undefined,
//           videoLength: video.video_length || undefined,
//           videoSize: video.video_size,
//           summary: video.summary || undefined,
//           metadata: video.metadata || undefined,
//           embeddings: video.embeddings || undefined,
//           userName: user?.username,
//           userAvatar: user?.avatar_url,
//         };
//       });
//     } catch (error) {
//       logger.error("Failed to list all videos", { error });
//       throw error;
//     }
//   }

//   static async getRecommendedVideos(userId: string): Promise<VideoMetadata[]> {
//     try {
//       logger.info("Getting recommended videos for user", { userId });

//       const client = await getAuthenticatedSupabaseClient();

//       // Get user's embedding
//       const { data: userData, error: userError } = await client
//         .from("users")
//         .select("user_embedding")
//         .eq("id", userId)
//         .single();

//       if (userError) throw userError;

//       // If user has no embedding yet, return recent videos
//       if (!userData?.user_embedding) {
//         logger.info("User has no embedding, returning recent videos");
//         return this.listAllVideos();
//       }

//       // Parse user embedding from string to array
//       const userEmbedding = JSON.parse(userData.user_embedding);

//       logger.info("User embedding retrieved", {
//         length: userEmbedding.length,
//         sample: userEmbedding.slice(0, 5),
//       });

//       // Get videos with embeddings, excluding user's own videos
//       const { data: videos, error: videosError } = await client
//         .from("videos")
//         .select()
//         .not("embeddings", "is", null)
//         .order("created_at", { ascending: false });

//       if (videosError) {
//         logger.error("Error fetching videos", { error: videosError });
//         throw new Error(`Failed to fetch videos: ${videosError.message}`);
//       }

//       if (!videos || videos.length === 0) {
//         logger.info("No videos found with embeddings, returning recent videos");
//         return this.listAllVideos();
//       }

//       // Get unique user IDs from videos
//       const userIds = Array.from(new Set(videos.map(video => video.user_id)));

//       // Fetch user info for all users in one query
//       const { data: users, error: usersError } = await client
//         .from("users")
//         .select("id, username, avatar_url")
//         .in("id", userIds);

//       if (usersError) throw usersError;

//       // Create a map of user info for quick lookup
//       const userMap = new Map(users.map(user => [user.id, user]));

//       // Calculate cosine similarity and sort videos
//       const scoredVideos = videos
//         .filter(video => video.embeddings) // Ensure video has embeddings
//         .map(video => {
//           // Parse embeddings if they're stored as string
//           const videoEmbeddings =
//             typeof video.embeddings === "string"
//               ? JSON.parse(video.embeddings)
//               : video.embeddings;

//           // Calculate cosine similarity between user and video embeddings
//           const similarity =
//             videoEmbeddings.reduce(
//               (sum: number, val: number, i: number) =>
//                 sum + val * userEmbedding[i],
//               0
//             ) /
//             (Math.sqrt(
//               videoEmbeddings.reduce(
//                 (sum: number, val: number) => sum + val * val,
//                 0
//               )
//             ) *
//               Math.sqrt(
//                 userEmbedding.reduce(
//                   (sum: number, val: number) => sum + val * val,
//                   0
//                 )
//               ));

//           return {
//             ...video,
//             score: similarity,
//           };
//         })
//         .sort((a, b) => b.score - a.score);

//       logger.info("Videos ranked by similarity", {
//         totalVideos: scoredVideos.length,
//         topScore: scoredVideos[0]?.score,
//         bottomScore: scoredVideos[scoredVideos.length - 1]?.score,
//       });

//       // Map to VideoMetadata format
//       return scoredVideos.map(video => {
//         const user = userMap.get(video.user_id);
//         return {
//           id: video.id,
//           url: video.url,
//           caption: video.caption,
//           userId: video.user_id,
//           createdAt: video.created_at,
//           transcription: video.transcription || undefined,
//           tags: video.tags || undefined,
//           videoLength: video.video_length || undefined,
//           videoSize: video.video_size,
//           summary: video.summary || undefined,
//           metadata: video.metadata || undefined,
//           embeddings: video.embeddings || undefined,
//           userName: user?.username,
//           userAvatar: user?.avatar_url,
//         };
//       });
//     } catch (error) {
//       logger.error("Failed to get recommended videos", {
//         error: error instanceof Error ? error.message : "Unknown error",
//         userId,
//       });
//       // Fallback to listing all videos if recommendation fails
//       return this.listAllVideos();
//     }
//   }
// }
