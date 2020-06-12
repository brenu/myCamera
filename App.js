import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Camera, getPermissionsAsync } from "expo-camera";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashType, setFlashType] = useState(Camera.Constants.FlashMode.off);
  const [zoomType, setZoomType] = useState(0);
  const [foto, setFoto] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState("");

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

  // Function that has to take pictures from the camera
  async function takePicture() {
    if (this.camera) {
      const options = { quality: 1, skiProcessing: false };
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
        const record = await this.camera.recordAsync();
        await MediaLibrary.saveToLibraryAsync(record.uri);
        return record.uri;
      } else {
        await this.camera.stopRecording();
        return "nothing";
      }
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    return result.uri;
  }

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
          <FontAwesome name="bolt" style={{ color: "#fff", fontSize: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setZoomType(zoomType === 0 ? 0.5 : 0);
          }}
        >
          <FontAwesome name="search" style={{ color: "#fff", fontSize: 30 }} />
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
          ></Camera>
        </View>
        <View style={styles.btnsContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setFoto(pickImage);
            }}
          >
            <Ionicons
              name="ios-photos"
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setFoto(takePicture());
            }}
          >
            <FontAwesome
              name="camera"
              style={{ color: "#fff", fontSize: 40 }}
            />
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
              style={{ color: "#fff", fontSize: 40 }}
            />
          </TouchableOpacity>
        </View>
        {foto !== "" && (
          <View style={styles.fotoContainer}>
            <Image source={foto} style={styles.foto} />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 0.06,
    flexDirection: "row",
    backgroundColor: "#444",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#444",
    justifyContent: "flex-start",
  },
  btn: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  btnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  cameraContainer: {
    flex: 0.85,
    backgroundColor: "#444",
    marginTop: 0,
  },
  camera: {
    flex: 1,
    marginTop: 0,
  },
  botaoFoto: {
    backgroundColor: "#f00",
    padding: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  fotoContainer: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#00000055",
    justifyContent: "center",
    alignItems: "center",
  },
  foto: {
    height: "100%",
    resizeMode: "contain",
  },
});
