import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useMemo, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

type User = { 
    id?: string; 
    email: string; 
    name: string; 
    avatar?: string; 
    role?: "admin"|"user" 
};

type AuthState = {
    user: User | null; 
    token: string | null;
};

type AuthContextType = AuthState & {
    signIn: () => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const GOOGLE_CLIENT_IDS = {
    expo: "160163168370-nmqgmietj3h9o68ditrm0bsgcdnqshf5.apps.googleusercontent.com",
    ios: "160163168370-ij5imrsvssm4qvpm52mo9nq7r00rh160.apps.googleusercontent.com",
    android: "160163168370-503j96mnd9j8p5ckplhupl0q0qakt8o2.apps.googleusercontent.com",
};

const API_URL = "https://ticketing.development.atelier.ovh/api/mobile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({ 
        user: null, 
        token: null });

const [request, , promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_IDS.expo,
    iosClientId: GOOGLE_CLIENT_IDS.ios,
    androidClientId: GOOGLE_CLIENT_IDS.android,
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({ useProxy: true }),
});
      // Fonction de connexion complète
const loginWithGoogle = async () => {
const res = await promptAsync();

    if (res?.type === "success" && res.authentication?.accessToken) {
        const googleAccessToken = res.authentication.accessToken;

        // 1️⃣ Récupérer profil Google
        const profile = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${googleAccessToken}` },
        }).then((r) => r.json());

        // 2️⃣ Appeler ton API interne
        const apiResponse = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { Authorization: `Bearer ${googleAccessToken}` },
        }).then((r) => r.json());

    // Exemple de réponse attendue de ton API :
    // {
    //   "role": "admin",
    //   "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    // }

    // 3️⃣ Construire l’utilisateur
    const user: User = {
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
    role: apiResponse.role ?? "user",
    };

    // 4️⃣ Stocker dans le contexte
    setState({ user, token: apiResponse.jwt });
}
};

 // Déconnexion
const signOut = () => setState({ user: null, token: null });

const value = useMemo<AuthContextType>(
() => ({
    ...state,
    signIn: loginWithGoogle,
    signOut,
}),
    [state]
);


return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook custom pour accéder au contexte
export const useAuth = () => {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error("useAuth must be used within AuthProvider");
return ctx;
};