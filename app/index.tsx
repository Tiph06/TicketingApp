import { getTicketsByStatus, Ticket } from "@/api/tickets";
import { useAuth } from "@/contexte/AuthContext";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function Column({
  title,
  data,
  loading,
}: { title: string; data: Ticket[] | undefined; loading: boolean }) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnTitle}>{title}</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        data?.map(t => (
          <View key={t.id} style={styles.ticketCard}>
            <Text style={styles.ticketTitle}>{t.title}</Text>
          </View>
        ))
      )}
    </View>
  );
}

export default function IndexScreen() {
  const { user, token, signIn, signOut } = useAuth();
  const [open, setOpen] = React.useState<Ticket[]>();
  const [doing, setDoing] = React.useState<Ticket[]>();
  const [closed, setClosed] = React.useState<Ticket[]>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      setLoading(true);
      const [a, b, c] = await Promise.all([
        getTicketsByStatus("open", token),
        getTicketsByStatus("in_progress", token),
        getTicketsByStatus("closed", token),
      ]);
      if (mounted) {
        setOpen(a);
        setDoing(b);
        setClosed(c);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user, token]);

  // 🔐 Si pas connecté → bouton Google
  if (!user) {
    return (
      <View style={styles.loginWrapper}>
        <Pressable onPress={signIn} style={styles.googleBtn}>
          <Text style={styles.googleBtnText}>Se connecter avec Google</Text>
        </Pressable>
      </View>
    );
  }

  // ✅ Connecté → 3 containers de tickets
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Bonjour, {user.name} 👋</Text>
          <Text style={styles.subtitle}>Voici vos tickets</Text>
        </View>
        <Pressable onPress={signOut} style={styles.signoutBtn}>
          <Text style={styles.signoutText}>Se déconnecter</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.columns}>
        <Column title="Ouverts" loading={loading} data={open} />
        <Column title="En cours" loading={loading} data={doing} />
        <Column title="Fermés" loading={loading} data={closed} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginWrapper: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  googleBtn: { backgroundColor: "#1a73e8", paddingVertical: 14, paddingHorizontal: 18, borderRadius: 10 },
  googleBtnText: { color: "#fff", fontWeight: "700" },

  container: { flex: 1, backgroundColor: "#f7f7fb" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  hello: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#6b7280", marginTop: 2 },

  signoutBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: "#eee" },
  signoutText: { fontWeight: "600" },

  columns: { padding: 12, gap: 12 },
  column: { backgroundColor: "#fff", padding: 12, borderRadius: 12, elevation: 1 },
  columnTitle: { fontWeight: "700", marginBottom: 8 },

  ticketCard: { backgroundColor: "#f5f5f7", padding: 10, borderRadius: 10, marginBottom: 8 },
  ticketTitle: { fontWeight: "600" },
});
