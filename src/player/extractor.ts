import { BaseExtractor, Track } from "discord-player";
import { exec } from "youtube-dl-exec";
import type { ExtractorInfo, ExtractorSearchContext } from "discord-player";
import type { Readable } from "stream";

export class YoutubeExtractor extends BaseExtractor {
  static identifier: string = "Youtube" as const;

  async validate(query: string): Promise<boolean> {
    try {
      await exec(query, {
        simulate: true,
        dumpJson: true,
        defaultSearch: "ytsearch1",
        noPlaylist: true,
      });

      return true;
    } catch {
      return false;
    }
  }

  async handle(
    query: string,
    context: ExtractorSearchContext
  ): Promise<ExtractorInfo> {
    try {
      const rawData = await exec(query, {
        dumpJson: true,
        defaultSearch: "ytsearch1",
        noPlaylist: true,
      });

      const data = JSON.parse(rawData.stdout);

      const track = new Track(this.context.player, {
        title: data.title,
        description: data.description || "",
        author: data.uploader,
        url: data.webpage_url,
        thumbnail: data.thumbnail,
        duration: data.duration_string,
        views: data.view_count,
        requestedBy: context.requestedBy,
        source: "youtube",
        queryType: "youtubeVideo",
        raw: data,
      });

      return this.createResponse(null, [track]);
    } catch (error) {
      console.error("yt-dlp Extractor Error:", error);
      return this.createResponse(null, []);
    }
  }

  async stream(track: Track): Promise<Readable | string> {
    const process = exec(
      track.url,
      {
        output: "-",
        format: "bestaudio/best",
        bufferSize: "512K",
        noPart: true,
        socketTimeout: 30,
        limitRate: "100M",
        retries: 10,
        noPlaylist: true,
      },
      {
        stdio: ["ignore", "pipe", "ignore"],
      }
    );

    return new Promise((resolve, reject) => {
      if (!process.stdout) {
        reject(new Error("Failed to create a readable stream from yt-dlp."));
      } else {
        resolve(process.stdout);
      }
    });
  }
}
