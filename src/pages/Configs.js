import React, { useEffect, useState } from "react";
import {
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from "react-native";

export default function Configs({ navigation }) {
  const [quality, setQuality] = useState(1);
  const [videoQuality, setVideoQuality] = useState("2160p");

  useEffect(() => {
    async function getData() {
      const imageData = await AsyncStorage.getItem("quality");
      const videoData = await AsyncStorage.getItem("videoQuality");

      if (imageData) {
        setQuality(Number(imageData));
      }

      if (videoData) {
        setVideoQuality(videoData);
      }
    }

    getData();
  }, [navigation]);

  useEffect(() => {
    async function handleSettings() {
      await AsyncStorage.setItem("quality", String(quality));
    }

    handleSettings();
  }, [quality]);

  useEffect(() => {
    async function handleSettings() {
      await AsyncStorage.setItem("videoQuality", videoQuality);
    }

    handleSettings();
  }, [videoQuality]);

  function handleQuality() {
    setQuality(quality + 0.45);
    if (quality >= 1.0) {
      setQuality(0.1);
    }

    return;
  }

  async function handleVideoQuality() {
    if (videoQuality === "720p") {
      setVideoQuality("1080p");
    } else if (videoQuality === "1080p") {
      setVideoQuality("2160p");
    } else if (videoQuality === "2160p") {
      setVideoQuality("720p");
    }

    return;
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
          <Text style={styles.optionTitle}>Video Quality</Text>
          <Text style={styles.optionValue}>{videoQuality}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionTitle}>Camera2API</Text>
          <Text style={styles.optionValue}>Off</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionTitle}>Focus</Text>
          <Text style={styles.optionValue}>auto</Text>
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
    fontWeight: "bold",
    color: "#444",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  containerText: {},
  option: {
    alignSelf: "stretch",
    flexDirection: "row",
    height: 62,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#777",
  },
  optionValue: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#777",
  },
});
