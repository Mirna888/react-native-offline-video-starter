import { useState, useEffect } from 'react';
import {
  registerPlugin,
  isRegistered,
  downloadStream,
  getDownloadsStatus,
  getDownloadedAssets,
  deleteDownloadedAsset,
  deleteAllDownloadedAssets,
  pauseDownload,
  resumeDownload,
  cancelDownload,
  useEvent,
  type DownloadStatus,
  type DownloadedAsset,
  type DownloadOptions,
} from '@TheWidlarzGroup/react-native-video-stream-downloader';

export const useStreamDownloader = (apiKey: string) => {
  const [downloads, setDownloads] = useState<DownloadStatus[]>([]);
  const [assets, setAssets] = useState<DownloadedAsset[]>([]);
  const [loading, setLoading] = useState(true);

  /** 🔹 SDK initialization and fetch initial data */
  useEffect(() => {
    const init = async () => {
      try {
        await registerPlugin(apiKey);

        await Promise.all([refreshDownloads(), refreshAssets()]);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing SDK:', error);
      }
    };
    init();
  }, [apiKey]);

  /** 🔹 Fetch current download status */
  const refreshDownloads = async () => {
    try {
      const current = await getDownloadsStatus();
      setDownloads(current);
      console.log('Current downloads:', current);
    } catch (err) {
      console.error('Failed to get download status:', err);
    }
  };

  /** 🔹 Fetch downloaded assets */
  const refreshAssets = async () => {
    try {
      const downloaded = await getDownloadedAssets();
      setAssets(downloaded);
      console.log('Downloaded assets:', downloaded);
    } catch (err) {
      console.error('Failed to get downloaded assets:', err);
    }
  };

  /** 🔹 SDK events */
  useEvent('onDownloadProgress', async statuses => {
    console.log('Download progress event received ', statuses);
    setDownloads(prev => {
      const updated = [...prev];

      statuses.forEach(status => {
        if (status.status === 'completed') return;

        const index = updated.findIndex(d => d.id === status.id);
        if (index !== -1) {
          updated[index] = status;
        } else {
          updated.push(status);
        }
      });

      return updated;
    });
  });

  useEvent('onDownloadEnd', async () => {
    console.log('Download end event received');
    await refreshDownloads();
    await refreshAssets();
  });

  /** 🔹 Start download */
  const start = async (url: string, config?: DownloadOptions) => {
    console.log('Starting download for URL:', url);
    const status = await downloadStream(url, config);
    console.log('Download started with status:', status);
    await refreshDownloads();
    return status.id;
  };

  /** 🔹 Delete single asset */
  const deleteAsset = async (id: string) => {
    console.log('Deleting asset with ID:', id);
    await deleteDownloadedAsset(id);
    console.log('Asset deleted');
    await Promise.all([refreshAssets(), refreshDownloads()]);
  };

  /** 🔹 Delete all assets */
  const clearAll = async () => {
    await deleteAllDownloadedAssets();
    await refreshAssets();
  };

  return {
    loading,
    downloads,
    assets,
    start,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    deleteAsset,
    clearAll,
    refreshDownloads,
    refreshAssets,
    getAssetList: async () => await getDownloadedAssets(),
    isRegistered,
  };
};
