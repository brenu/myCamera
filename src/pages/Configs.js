import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from 'react-native';

export default function Configs({ navigation }) {
  const [quality, setQuality] = useState(1);
  const [videoQuality, setVideoQuality] = useState('720p');
  const [camera2api, setCamera2api] = useState('false');
  const [focus, setFocus] = useState('false');
  const [loadDone, setLoadDone] = useState(false);

  useEffect(() => {
    async function handleSettings() {
      const imageData = await AsyncStorage.getItem('quality');
      const videoData = await AsyncStorage.getItem('videoQuality');
      const cameraApiData = await AsyncStorage.getItem('camera2api');
      const focusData = await AsyncStorage.getItem('focus');

      if (imageData) {
        setQuality(Number(imageData));
      }

      if (videoData) {
        setVideoQuality(videoData);
      }

      if (cameraApiData) {
        setCamera2api(cameraApiData);
      }

      if (focusData) {
        setFocus(focusData);
      }

      setLoadDone(true);
    }

    handleSettings();
  }, []);

  useEffect(() => {
    async function handleSettings() {
      if (loadDone) {
        setTimeout(() => {
          AsyncStorage.setItem('quality', String(quality));
        }, 200);
        setTimeout(() => {
          AsyncStorage.setItem('videoQuality', videoQuality);
        }, 200);
        setTimeout(() => {
          AsyncStorage.setItem('camera2api', camera2api);
        }, 200);
        setTimeout(() => {
          AsyncStorage.setItem('focus', focus);
        }, 200);
      }
    }

    handleSettings();
  }, [quality, videoQuality, camera2api, focus]);

  function handleQuality() {
    setQuality(quality + 0.45);
    if (quality >= 1.0) {
      setQuality(0.1);
    }
  }

  function handleVideoQuality() {
    if (videoQuality === '720p') {
      setVideoQuality('1080p');
    } else if (videoQuality === '1080p') {
      setVideoQuality('2160p');
    } else if (videoQuality === '2160p') {
      setVideoQuality('720p');
    }
  }

  function handleCameraApi() {
    if (camera2api === 'true') {
      setCamera2api('false');
    } else {
      setCamera2api('true');
    }
  }

  function handleFocus() {
    if (focus === 'false') {
      setFocus('true');
    } else {
      setFocus('false');
    }
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurations</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={handleQuality}>
          <Text style={styles.optionTitle}>Image Quality</Text>
          <Text style={styles.optionValue}>{(quality * 100).toFixed(0)}%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleVideoQuality}>
          <Text style={styles.optionTitle}>Video Resolution</Text>
          <Text style={styles.optionValue}>{videoQuality}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleCameraApi}>
          <Text style={styles.optionTitle}>Camera2API</Text>
          <Text style={styles.optionValue}>
            {camera2api === 'true' ? 'On' : 'Off'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.option,
            camera2api === 'false' ? { backgroundColor: '#eee' } : {},
          ]}
          disabled={camera2api === 'false' ? true : false}
          onPress={handleFocus}
        >
          <Text style={styles.optionTitle}>Focus</Text>
          <Text style={styles.optionValue}>
            {focus === 'true' ? 'manual' : 'auto'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: StatusBar.currentHeight + 20,
    paddingHorizontal: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  containerText: {},
  option: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 62,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#ddd',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#777',
  },
  optionValue: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#777',
  },
});
