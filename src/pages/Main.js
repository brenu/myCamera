import React, { useState, useEffect } from 'react';
import {
  AsyncStorage,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  StatusBar,
} from 'react-native';
import { Camera, getPermissionsAsync, Constants } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';

export default function Main({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashType, setFlashType] = useState(Camera.Constants.FlashMode.off);
  const [zoomType, setZoomType] = useState(0);
  const [foto, setFoto] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState('');
  const [mode, setMode] = useState('photo');

  //Props for the settings
  const [quality, setQuality] = useState(1);
  const [videoQuality, setVideoQuality] = useState('2160p');
  const [camera2api, setCamera2api] = useState('false');
  const [autoFocus, setAutoFocus] = useState('false');
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    (async () => {
      let status = await Camera.requestPermissionsAsync();
      setHasCameraPermission(status.granted === true);
      let abreGa = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasCameraRollPermission(abreGa.granted === true);
      let audio = await Audio.requestPermissionsAsync();
      setHasAudioPermission(audio.granted === true);
    })();
  }, []);

  useFocusEffect(() => {
    async function handleSettings() {
      const imageData = await AsyncStorage.getItem('quality');
      const videoData = await AsyncStorage.getItem('videoQuality');
      const cameraApiData = await AsyncStorage.getItem('camera2api');
      const focusData = await AsyncStorage.getItem('focus');

      if (imageData !== null) {
        setQuality(Number(imageData));
      }

      if (videoData !== null) {
        setVideoQuality(videoData);
      }

      if (cameraApiData !== null) {
        setCamera2api(cameraApiData);
      }

      if (focusData !== null) {
        setAutoFocus(focusData);
      }
    }

    handleSettings();
  }, []);

  useEffect(() => {
    console.log(focus);
  }, [focus]);

  if (
    hasCameraPermission === null ||
    hasCameraRollPermission === null ||
    hasAudioPermission === null
  ) {
    return <View />;
  }
  if (
    hasCameraPermission === false ||
    hasCameraRollPermission === false ||
    hasAudioPermission === false
  ) {
    return <Text>No access to camera</Text>;
  }

  function handleMode() {
    return mode === 'photo' ? takePicture() : handleRecording();
  }

  // Function that has to take pictures from the camera
  async function takePicture() {
    if (this.camera) {
      const options = { quality: quality, skiProcessing: false };
      const photo = await this.camera.takePictureAsync(options);
      await MediaLibrary.saveToLibraryAsync(photo.uri);

      return photo.uri;
    }
  }

  // Function that handles the video recording process
  async function handleRecording() {
    if (isRecording === false) {
      setVideo(videoRecord());
      setIsRecording(true);
      return;
    } else {
      videoRecord();
      setIsRecording(false);
    }
  }

  // Function that has to record videos from the camera
  async function videoRecord() {
    if (this.camera) {
      if (isRecording === false) {
        const options = { quality: videoQuality };
        const record = await this.camera.recordAsync(options);
        await MediaLibrary.saveToLibraryAsync(record.uri);
        return record.uri;
      } else {
        await this.camera.stopRecording();
        return '';
      }
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    return { localUri: result.uri };
  }

  function handleConfigNavigation() {
    navigation.navigate('Configs', { focus: 2 });
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setFlashType(
              flashType === Camera.Constants.FlashMode.torch
                ? Camera.Constants.FlashMode.off
                : Camera.Constants.FlashMode.torch
            );
          }}
        >
          <FontAwesome name="bolt" style={{ color: '#fff', fontSize: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setZoomType(zoomType === 0 ? 0.5 : 0);
          }}
        >
          <FontAwesome name="search" style={{ color: '#fff', fontSize: 30 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={type}
            ref={(ref) => {
              this.camera = ref;
            }}
            flashMode={flashType}
            zoom={zoomType}
            /*
            useCamera2Api={camera2api === 'false' ? false : true}
            autoFocus={
              autoFocus === 'false'
                ? Camera.Constants.AutoFocus.off
                : Camera.Constants.AutoFocus.on
            }
            focusDepth={undefined}
            */
          >
            {autoFocus === 'true' ? (
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={0}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#60AAEE"
                  value={focus}
                  onValueChange={(focus) => setFocus(focus)}
                />
              </View>
            ) : (
              <View />
            )}
          </Camera>
        </View>
        <View style={styles.btnsContainer}>
          <View style={styles.optionsBtnsContainer}>
            {mode === 'photo' ? (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setMode('video')}
              >
                <Ionicons
                  name="ios-videocam"
                  style={{ color: '#fff', fontSize: 30 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setMode('photo')}
              >
                <Ionicons
                  name="ios-camera"
                  style={{ color: '#fff', fontSize: 30 }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.btn}
              onPress={handleConfigNavigation}
            >
              <Ionicons
                name="ios-construct"
                style={{ color: '#fff', fontSize: 25 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.mainBtnsContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={async () => {
                const image = await pickImage();
                setFoto(image);
              }}
            >
              <Ionicons
                name="ios-photos"
                style={{ color: '#fff', fontSize: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleMode}>
              {mode === 'photo' ? (
                <FontAwesome
                  name="camera"
                  style={{ color: '#fff', fontSize: 60 }}
                />
              ) : (
                <>
                  {isRecording === false ? (
                    <FontAwesome
                      name="circle"
                      style={{ color: '#d33', fontSize: 60 }}
                    />
                  ) : (
                    <FontAwesome
                      name="stop-circle"
                      style={{ color: '#d33', fontSize: 60 }}
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <MaterialCommunityIcons
                name="camera-switch"
                style={{ color: '#fff', fontSize: 40 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {foto && (
        <RectButton style={styles.fotoContainer} onPress={() => setFoto(null)}>
          <View style={styles.fotoCard}>
            <Image source={{ uri: foto.localUri }} style={styles.foto} />
          </View>
        </RectButton>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 0.06,
    flexDirection: 'row',
    backgroundColor: '#444',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#444',
    justifyContent: 'flex-start',
  },
  btn: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnsContainer: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 50,
  },
  optionsBtnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  mainBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  cameraContainer: {
    flex: 0.85,
    backgroundColor: '#444',
    marginTop: 0,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 0,
  },
  botaoFoto: {
    backgroundColor: '#f00',
    padding: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  fotoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  fotoCard: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  foto: {
    height: 400,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 50,
    paddingHorizontal: -20,
  },
  slider: {
    width: 100,
    transform: [{ rotate: '-90deg' }],
  },
});
