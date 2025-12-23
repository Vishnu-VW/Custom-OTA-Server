import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Updates from "expo-updates";

export default function App() {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  async function onFetchUpdateAsync() {
    try {
      setChecking(true);
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true);
        Alert.alert(
          "Update Available",
          "A new update is available. Download now?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "OK",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        Alert.alert("Up to Date", "You are running the latest version.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to check for updates: " + e.message);
    } finally {
      setChecking(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xavia OTA Client</Text>
      <Text style={styles.status}>
        Current Update ID: {Updates.updateId || "Development"}
      </Text>
      <Text style={styles.status}>Channel: {Updates.channel}</Text>

      {checking ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Check for Updates" onPress={onFetchUpdateAsync} />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Connected to: http://localhost:3001/api/manifest
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  footer: {
    position: "absolute",
    bottom: 50,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
