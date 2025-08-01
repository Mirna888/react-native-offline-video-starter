import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { setConfig } from '@TheWidlarzGroup/react-native-video-stream-downloader';
import VideoList from './src/VideoList.tsx';
import VideoScreen from './src/VideoScreen.tsx';

export type RootStackParamList = {
  VideoList: undefined;
  VideoScreen: { uri: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    VideoList: VideoList,
    VideoScreen: VideoScreen,
  },
  screenOptions: {
    headerShown: false,
  },
});

const Navigation = createStaticNavigation(RootStack);

const App = () => {
  setConfig({
    maxParallelDownloads: 4,
    updateFrequencyMS: 1000,
  });

  return <Navigation />;
};
export default App;
