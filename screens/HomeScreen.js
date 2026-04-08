import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import FocusButton from '../components/FocusButton';
import HomeHeader from '../components/HomeHeader';
import ScrollTimePicker from '../components/ScrollTimePicker';
import StatCard from '../components/StatCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const timerSize = isCompact ? Math.min(width * 0.3, 108) : Math.min(width * 0.34, 124);
  const headingSize = isCompact ? Math.min(width * 0.074, 25) : Math.min(width * 0.086, 30);
  const sublineSize = isCompact ? Math.min(width * 0.046, 16) : Math.min(width * 0.053, 19);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { paddingHorizontal: isCompact ? 14 : 22 }]}>
        <HomeHeader />

        <View style={[styles.heroWrap, { marginTop: isCompact ? 12 : 20 }]}>
          <ScrollTimePicker
            minutes={minutes}
            seconds={seconds}
            onMinutesChange={setMinutes}
            onSecondsChange={setSeconds}
            timerSize={timerSize}
          />
          <Text style={[styles.headline, { fontSize: headingSize, marginTop: isCompact ? 8 : 12 }]}>
            STAY LOCKED IN
          </Text>
          <Text style={[styles.subline, { fontSize: sublineSize, marginTop: isCompact ? 10 : 14 }]}>
            No pauses. No excuses.
          </Text>

          <View style={[styles.buttonWrap, { marginTop: isCompact ? 22 : 34 }]}>
            <FocusButton
              title="START FOCUS"
              compact={isCompact}
              onPress={() => navigation.navigate('FocusForm')}
            />
          </View>
        </View>

        <StatCard compact={isCompact} />
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
  },
  heroWrap: {
    alignItems: 'center',
  },
  headline: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 3.4,
    textTransform: 'uppercase',
  },
  subline: {
    color: '#9D9D9D',
    fontWeight: '500',
  },
  buttonWrap: {},
});
