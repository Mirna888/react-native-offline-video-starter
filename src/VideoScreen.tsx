import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { type RouteProp, useRoute } from '@react-navigation/native';

const VideoScreen = () => {
  const route = useRoute<RouteProp<{ params: { uri: string } }, 'params'>>();
  const { uri } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: uri }}
        controls
        resizeMode="contain"
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  video: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 9) / 16,
  },
});

export default VideoScreen;
