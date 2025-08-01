import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

interface VideoItem {
  id: string;
  title: string;
  status: 'downloading' | 'finished' | 'failed' | 'paused' | 'canceled';
}

interface VideoStore {
  downloadedVideos: VideoItem[];
  addDownloadedVideo: (video: VideoItem) => void;
  deleteDownloadedVideo: (id: string) => void;
  updateDownloadStatus: (id: string, status: VideoItem['status']) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  downloadedVideos: JSON.parse(storage.getString('downloadedVideos') || '[]'),

  /** Dodawanie nowego pobrania */
  addDownloadedVideo: (video) =>
    set((state) => {
      const updatedVideos = [...state.downloadedVideos, { ...video }];
      storage.set('downloadedVideos', JSON.stringify(updatedVideos));
      return { downloadedVideos: updatedVideos };
    }),

  /** Usuwanie pobranego pliku */
  deleteDownloadedVideo: (id) =>
    set((state) => {
      const updatedVideos = state.downloadedVideos.filter(
        (video) => video.id !== id
      );
      storage.set('downloadedVideos', JSON.stringify(updatedVideos));
      return { downloadedVideos: updatedVideos };
    }),

  /** Aktualizacja statusu pobierania */
  updateDownloadStatus: (id, status) =>
    set((state) => {
      const updatedVideos = state.downloadedVideos.map((video) =>
        video.id === id ? { ...video, status } : video
      );
      storage.set('downloadedVideos', JSON.stringify(updatedVideos));
      return { downloadedVideos: updatedVideos };
    }),
}));
