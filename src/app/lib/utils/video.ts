import { exec } from "child_process";
import { promisify } from "util";
import { Logger } from "@/app/utils/logger";

const execAsync = promisify(exec);
const logger = new Logger("VideoUtils");

export async function getVideoDuration(
  filePath: string
): Promise<string | null> {
  try {
    logger.info("Getting video duration", { filePath });

    // Use ffprobe to get video duration
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );

    // Convert seconds to interval string
    const seconds = parseFloat(stdout);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format as PostgreSQL interval
    const parts = [];
    if (hours > 0) parts.push(`${hours} hours`);
    if (minutes > 0) parts.push(`${minutes} minutes`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds} seconds`);

    return parts.join(" ");
  } catch (error) {
    logger.error("Failed to get video duration", { error });
    return null;
  }
}
