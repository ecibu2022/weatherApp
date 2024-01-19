import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Weather from './Components/Weather.jsx';

export default function App() {
  return (
    <View style={styles.container}>
      <Weather />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECDBBA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
