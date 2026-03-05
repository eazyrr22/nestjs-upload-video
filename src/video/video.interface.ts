import { VideoGenres } from "./video.dto";

export interface IVideo {
  id: string;
  title: string;
  description: string;
  author: string;
  targetAudience: string;
  genre: VideoGenres;
  duration: string;
  fileUrl?: string;
}