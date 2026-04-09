import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';

function formatTime(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function ActiveSessionScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const objective = String(route?.params?.objective || 'DEEP WORK');
  const mode = String(route?.params?.mode || 'focus');
  const initialSeconds = Number(route?.params?.plannedSeconds || 1500);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const completionTriggeredRef = useRef(false);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return undefined;
    }
    const tick = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds !== 0 || completionTriggeredRef.current) {
      return;
    }
    completionTriggeredRef.current = true;

    let mounted = true;
    const completeSession = async () => {
      try {
        const sessionId = route?.params?.sessionId;
        if (sessionId) {
          await apiFetch(`/sessions/${sessionId}/complete`, {
            method: 'POST',
          });
        }
      } catch (_error) {
        // Keep UX moving even if completion API fails.
      } finally {
        if (mounted) {
          navigation.navigate('SessionCompleted', {
            objective,
            mode,
          });
        }
      }
    };

    completeSession();
    return () => {
      mounted = false;
    };
  }, [remainingSeconds, navigation, objective, mode, route?.params?.sessionId]);

  const modeLabel = useMemo(() => (mode === 'hyper' ? 'HYPER FOCUS' : 'FOCUS'), [mode]);
  const objectiveLabel = useMemo(() => objective.toUpperCase(), [objective]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { paddingHorizontal: isCompact ? 18 : 24 }]}>
        <View style={styles.topWrap}>
          <Text style={[styles.ruleText, isCompact && styles.ruleTextCompact]}>DO NOT BREAK</Text>
          <View style={[styles.ruleLine, isCompact && styles.ruleLineCompact]} />
        </View>

        <View style={styles.centerWrap}>
          <Text
            style={[styles.timer, isCompact && styles.timerCompact]}
            numberOfLines={1}
            ellipsizeMode="clip"
            allowFontScaling={false}
          >
            {formatTime(remainingSeconds)}
          </Text>
          <Text style={[styles.metaText, isCompact && styles.metaTextCompact]}>
            {`${modeLabel}   •   ${objectiveLabel}`}
          </Text>
        </View>

        <View style={[styles.bottomWrap, { marginBottom: 52 + insets.bottom }]}>
          <Text style={[styles.warning, isCompact && styles.warningCompact]}>LEAVING WILL RESET YOUR STREAK</Text>
          <Text style={styles.brand}>FOCUSX</Text>

          <Pressable
            style={[styles.quitButton, isCompact && styles.quitButtonCompact]}
            onPress={() =>
              navigation.navigate('WeakScreen', {
                sessionId: route?.params?.sessionId,
              })
            }
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
    fontSize: 88,
    fontWeight: '800',
    letterSpacing: 0.4,
    lineHeight: 94,
    textAlign: 'center',
    includeFontPadding: false,
    minWidth: 220,
  },
  timerCompact: {
    fontSize: 76,
    lineHeight: 82,
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
