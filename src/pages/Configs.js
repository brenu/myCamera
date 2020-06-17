import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from "react-native";

export default function Configs() {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurations</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionTitle}>Image/Video Quality</Text>
          <Text style={styles.optionValue}>1.0</Text>
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
