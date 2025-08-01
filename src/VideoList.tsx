import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { ResizeMode } from 'react-native-video';
import { useStreamDownloader } from './useStreamDownloader.ts';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Download } from './svgs/Download';
import { Play } from './svgs/Play';
import { Check } from './svgs/Check.tsx';
import VideoPlayer from 'react-native-video-player';
import RadialGradient from 'react-native-radial-gradient';
import { HD } from './svgs/HD.tsx';
import { useNavigation } from '@react-navigation/native';
import { type RootStackParamList } from '../App.tsx';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  getAvailableTracks,
  type DownloadOptions,
} from '@TheWidlarzGroup/react-native-video-stream-downloader';

type VideoItemType = {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail: string;
  description: string;
};

const videos: VideoItemType[] = [
  {
    id: '1',
    title: 'Sintel',
    url: 'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    duration: '12m',
    thumbnail:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    description:
      'Sintel is an independently produced short film, initiated by the Blender Foundation...',
  },
  {
    id: '2',
    title: 'Big Buck Bunny',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    duration: '13m',
    thumbnail:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    description:
      'Big Buck Bunny is a short computer-animated comedy film, featuring animals of the forest...',
  },
  {
    id: '3',
    title: 'For Bigger Blazes',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '2m',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    description:
      'For Bigger Blazes is a short film that shows off the capabilities of the Google Cloud Platform.',
  },
  {
    id: '4',
    title: 'For Bigger Escape',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '1m',
    thumbnail:
      'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    description:
      'For Bigger Escape is a short film that shows off the capabilities of the Google Cloud Platform.',
  },
];

const API_KEY = '<API_KEY>'; // Replace with your actual API key, which you can obtain at https://sdk.thewidlarzgroup.com/

const HeaderSection = () => {
  return (
    <View style={{ paddingTop: 20, gap: 20 }}>
      <View>
        <Text style={styles.headerTitle}>Lorum Playlist</Text>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <Text style={styles.headerDesc}>4 movies</Text>
          <HD />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <TouchableOpacity style={styles.playButton}>
          <Play color={'#000'} />
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Download />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VideoPreview = () => {
  return (
    <VideoPlayer
      source={{ uri: videos[0].url }}
      volume={0}
      autoplay
      paused
      pauseOnPress
      videoWidth={Dimensions.get('window').width}
      videoHeight={(Dimensions.get('window').width / 16) * 9}
      resizeMode={ResizeMode.COVER}
      hideControlsOnStart
      customStyles={{
        seekBarBackground: { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
        wrapper: {
          width: Dimensions.get('window').width,
          maxHeight: (Dimensions.get('window').width / 16) * 9,
        },
      }}
      style={{
        width: Dimensions.get('window').width,
        maxHeight: (Dimensions.get('window').width / 16) * 9,
      }}
    />
  );
};

type DownloadControlsProps = {
  status: any;
  loading: boolean;
  resumeDownload: (url: string) => void;
  deleteAsset: (id: string) => void;
  start: (url: string, options: DownloadOptions) => void;
  item: VideoItemType;
};

const DownloadControls = ({
  status,
  loading,
  resumeDownload,
  deleteAsset,
  start,
  item,
}: DownloadControlsProps) => {
  const downloadStatus = status?.status ?? 'default';
  const progress = ((status?.progress ?? 0) * 100).toFixed(2);
  const isProgressStatus = ['downloading', 'paused', 'pending'].includes(
    downloadStatus,
  );
  const isCompletedStatus = ['completed'].includes(downloadStatus);
  const isFailedStatus = ['failed'].includes(downloadStatus);
  const toDownload =
    downloadStatus === 'default' ||
    (!isCompletedStatus && !isProgressStatus && !isFailedStatus);

  const handleDownload = async () => {
    /** Get available tracks for the video */
    const tracks = await getAvailableTracks(item.url);

    const selectedVideo = tracks.video?.[Math.floor(tracks.video.length / 2)];

    /** Start the download with selected video and all available text and audio tracks */
    start(item.url, {
      tracks: {
        video: selectedVideo ? [selectedVideo.id] : [],
        text: tracks.text?.map(t => t.id) || [],
        audio: tracks.audio?.map(a => a.id) || [],
      },
    });
  };

  if (loading) return null;

  return (
    <>
      {isProgressStatus && (
        <>
          <AnimatedCircularProgress
            size={40}
            style={{ marginRight: -10 }}
            width={10}
            padding={12}
            backgroundWidth={17}
            fill={parseFloat(progress)}
            tintColor="#fff"
            duration={500}
            backgroundColor="#444"
          />
          {downloadStatus === 'paused' && (
            <TouchableOpacity onPress={() => resumeDownload(item.url)}>
              <Play />
            </TouchableOpacity>
          )}
        </>
      )}
      {isCompletedStatus && (
        <TouchableOpacity onPress={() => status?.id && deleteAsset(status.id)}>
          <Check />
        </TouchableOpacity>
      )}
      {isFailedStatus && <Text>Failed</Text>}
      {toDownload && (
        <TouchableOpacity onPress={() => handleDownload()}>
          <Download />
        </TouchableOpacity>
      )}
    </>
  );
};

type VideoItemProps = {
  item: VideoItemType;
  index: number;
  openVideo: (video: VideoItemType) => void;
  getStatus: (url: string) => any;
  loading: boolean;
  resumeDownload: (url: string) => void;
  deleteAsset: (id: string) => void;
  start: (url: string, options: DownloadOptions) => void;
};

const VideoItem = ({
  item,
  index,
  openVideo,
  getStatus,
  loading,
  resumeDownload,
  deleteAsset,
  start,
}: VideoItemProps) => {
  const status = getStatus(item.url);
  return (
    <Pressable onPress={() => openVideo(item)}>
      <View style={{ marginBottom: 10, padding: 10 }}>
        <View style={styles.videoItem}>
          <Image
            source={{ uri: item.thumbnail }}
            resizeMode="cover"
            style={styles.thumbnail}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={styles.videoTitle}>{`${index + 1}. ${
                item.title
              }`}</Text>
              <Text style={styles.videoDuration}>{item.duration}</Text>
            </View>
            <View style={styles.controls}>
              <DownloadControls
                status={status}
                loading={loading}
                resumeDownload={resumeDownload}
                deleteAsset={deleteAsset}
                start={start}
                item={item}
              />
            </View>
          </View>
        </View>
        <Text style={styles.videoDuration}>{item.description}</Text>
      </View>
    </Pressable>
  );
};

const VideoList = () => {
  const { downloads, assets, start, resumeDownload, deleteAsset, loading } =
    useStreamDownloader(API_KEY);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getStatus = (url: string) => downloads.find(d => d.url === url);

  const openVideo = useCallback(
    (video: VideoItemType) => {
      const asset = assets.find(a => a.url === video.url);
      const localPath = asset?.pathToFile || null;
      navigation.navigate('VideoScreen', { uri: localPath || video.url });
    },
    [navigation, assets],
  );

  return (
    <SafeAreaView style={styles.container}>
      <RadialGradient
        colors={['#423D3F', '#382E37', '#252025']}
        stops={[0, 0.4, 1]}
        center={[
          Dimensions.get('window').width / 3,
          Dimensions.get('window').height / 1.5,
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          <VideoPreview />
          <HeaderSection />
          {videos.map((item, index) => (
            <VideoItem
              key={item.id}
              item={item}
              index={index}
              openVideo={openVideo}
              getStatus={getStatus}
              loading={loading}
              resumeDownload={resumeDownload}
              deleteAsset={deleteAsset}
              start={start}
            />
          ))}
        </ScrollView>
      </RadialGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerDesc: { fontSize: 14, color: '#c1c1c1' },
  playButton: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    flex: 1,
    borderRadius: 5,
  },
  playText: { color: 'black' },
  downloadButton: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: 'white', marginLeft: 5 },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 10,
  },
  thumbnail: { width: 160, height: 90, borderRadius: 5 },
  videoTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  videoDuration: { color: '#c1c1c1', fontSize: 14 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default VideoList;
