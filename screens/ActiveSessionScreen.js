import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActiveSessionScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { paddingHorizontal: isCompact ? 18 : 24 }]}>
        <View style={styles.topWrap}>
          <Text style={[styles.ruleText, isCompact && styles.ruleTextCompact]}>DO NOT BREAK</Text>
          <View style={[styles.ruleLine, isCompact && styles.ruleLineCompact]} />
        </View>

        <View style={styles.centerWrap}>
          <Text style={[styles.timer, isCompact && styles.timerCompact]}>42:18</Text>
          <Text style={[styles.metaText, isCompact && styles.metaTextCompact]}>SESSION   •   DEEP WORK</Text>
        </View>

        <View style={[styles.bottomWrap, { marginBottom: 52 + insets.bottom }]}>
          <Text style={[styles.warning, isCompact && styles.warningCompact]}>LEAVING WILL RESET YOUR STREAK</Text>
          <Text style={styles.brand}>FOCUSX</Text>

          <Pressable
            style={[styles.quitButton, isCompact && styles.quitButtonCompact]}
            onPress={() => navigation.navigate('WeakScreen')}
          >
            <Text style={[styles.quitLabel, isCompact && styles.quitLabelCompact]}>QUIT SESSION</Text>
          </Pressable>
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
    paddingVertical: 34,
  },
  topWrap: {
    alignItems: 'center',
    marginTop: 2,
  },
  ruleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4.2,
    marginBottom: 10,
  },
  ruleTextCompact: {
    fontSize: 12,
    letterSpacing: 3.4,
  },
  ruleLine: {
    width: 132,
    height: 3,
    backgroundColor: '#FFFFFF',
  },
  ruleLineCompact: {
    width: 116,
  },
  centerWrap: {
    alignItems: 'center',
    marginTop: -16,
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 98,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 104,
  },
  timerCompact: {
    fontSize: 84,
    lineHeight: 90,
  },
  metaText: {
    color: '#A8A8A8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2.6,
    marginTop: 14,
  },
  metaTextCompact: {
    fontSize: 12,
    letterSpacing: 2.1,
    marginTop: 10,
  },
  bottomWrap: {
    alignItems: 'center',
  },
  warning: {
    color: '#767676',
    fontSize: 18 / 2,
    fontWeight: '700',
    letterSpacing: 2.8,
    marginBottom: 44,
  },
  warningCompact: {
    fontSize: 8,
    letterSpacing: 2.2,
    marginBottom: 34,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 38 / 2,
    fontWeight: '800',
    letterSpacing: 2.1,
    marginBottom: 30,
  },
  quitButton: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    width: '78%',
    maxWidth: 340,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  quitButtonCompact: {
    paddingVertical: 10,
    width: '82%',
  },
  quitLabel: {
    color: '#A7A7A7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3.2,
  },
  quitLabelCompact: {
    fontSize: 9,
    letterSpacing: 2.7,
  },
});
