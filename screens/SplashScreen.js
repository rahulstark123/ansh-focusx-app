import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../utils/api';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const userId = await AsyncStorage.getItem('fx_user_id');
        if (!userId) {
          navigation.replace('FirstTimeUser');
          return;
        }

        const userState = await apiFetch(`/auth/users/${userId}/first-time`);
        if (userState.firstTime) {
          navigation.replace('FirstTimeUser');
        } else {
          navigation.replace('MainTabs');
        }
      } catch (_error) {
        navigation.replace('FirstTimeUser');
      }
    }, 1700);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.topName}>ANSH</Text>

        <View style={styles.centerWrap}>
          <Text style={styles.brand}>FOCUSX</Text>
          <View style={styles.brandMarkWrap}>
            <View style={styles.brandDot} />
            <View style={styles.brandLine} />
            <View style={styles.brandDot} />
          </View>
        </View>

        <View style={styles.bottomWrap}>
          <View style={styles.divider} />
          <Text style={styles.tagline}>BE IN THE 0.1% OF THINKERS</Text>
          <Text style={styles.chevron}>⌄</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  topName: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 8,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandMarkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  brandLine: {
    width: 106,
    height: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
  },
  bottomWrap: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#222222',
    marginBottom: 24,
  },
  tagline: {
    color: '#D8D8D8',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  chevron: {
    color: '#6F6F6F',
    marginTop: 22,
    fontSize: 20,
    lineHeight: 20,
  },
});
