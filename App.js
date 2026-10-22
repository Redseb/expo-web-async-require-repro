import { StatusBar } from 'expo-status-bar';
import { Suspense, lazy } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// On web, this dynamic import ends up in its own split chunk.
const LazyThing = lazy(() => import('./LazyThing'));

export default function App() {
  return (
    <View style={styles.container}>
      <Text>If a red "FATAL" banner appears, the bug reproduced.</Text>
      <Suspense fallback={<Text>Loading LazyThing…</Text>}>
        <LazyThing />
      </Suspense>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});
