import { useAuth } from "@/contexte/AuthContext";
import React from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function AuthScreen() {
    const { signIn } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.center}>
            <Image
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" }}
                style={{ width: 64, height: 64, marginBottom: 12 }}
            />
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>Authentification Google (Expo Go)</Text>

            <Pressable onPress={signIn} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}>
                <Text style={styles.buttonText}>Continuer avec Google</Text>
            </Pressable>
            </View>
        </SafeAreaView>
    );
}
    const styles = StyleSheet.create({
        container: { flex: 1, justifyContent: "center", backgroundColor: "#F8F8F8" },
        center: { alignItems: "center", paddingHorizontal: 24 },
        title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
        subtitle: { color: "#666", marginBottom: 18 },
        button: { backgroundColor: "#1A73E8", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
        buttonText: { color: "white", fontWeight: "600" },
});