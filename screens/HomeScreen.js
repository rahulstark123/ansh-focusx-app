import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import FocusButton from '../components/FocusButton';
import HomeHeader from '../components/HomeHeader';
import ScrollTimePicker from '../components/ScrollTimePicker';
import StatCard from '../components/StatCard';
import { apiFetch } from '../utils/api';
import { storageGetItem } from '../utils/storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [showUnsignedModal, setShowUnsignedModal] = useState(false);
  const [completedStreaks, setCompletedStreaks] = useState(0);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);
  const plannedSeconds = minutes * 60 + seconds;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadStats = async () => {
        try {
          const userId = await storageGetItem('fx_user_id');
          if (!userId) {
            if (active) {
              setCompletedStreaks(0);
              setTodayFocusMinutes(0);
            }
            return;
          }
          const analytics = await apiFetch(`/analytics/${userId}`);
          if (!active) {
            return;
          }
          setCompletedStreaks(Number(analytics?.completedStreaks || 0));
          setTodayFocusMinutes(Number(analytics?.todayFocusMinutes || 0));
        } catch (_error) {
          if (active) {
            setCompletedStreaks(0);
            setTodayFocusMinutes(0);
          }
        }
      };

      loadStats();
      return () => {
        active = false;
      };
    }, [])
  );

  const todayText = useMemo(() => {
    const hours = Math.floor(todayFocusMinutes / 60);
    const minutesOnly = todayFocusMinutes % 60;
    return `${hours}h ${minutesOnly}m`;
  }, [todayFocusMinutes]);

  const handleStartFocus = async () => {
    try {
      const userId = await storageGetItem('fx_user_id');
      if (!userId) {
        throw new Error('no_user');
      }

      const userState = await apiFetch(`/auth/users/${userId}/sign-in-state`);
      if (userState.signedIn) {
        navigation.navigate('FocusForm', { plannedSeconds });
        return;
      }
    } catch (_error) {
      // If user is missing or backend check fails, treat as not signed in.
    }
    setShowUnsignedModal(true);
  };

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
              onPress={handleStartFocus}
            />
          </View>
        </View>

        <StatCard compact={isCompact} completedStreaks={completedStreaks} todayText={todayText} />
      </View>

      <Modal
        transparent
        visible={showUnsignedModal}
        animationType="fade"
        onRequestClose={() => setShowUnsignedModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>NOT SIGNED UP</Text>
            <Text style={styles.modalBody}>
              You have not signed up on our platform. No record or streak will be recorded.
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowUnsignedModal(false);
                  navigation.navigate('FocusForm', { plannedSeconds });
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>CONTINUE</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => {
                  setShowUnsignedModal(false);
                  navigation.navigate('Signup');
                }}
              >
                <Text style={styles.modalButtonPrimaryText}>SIGN UP</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  modalBody: {
    color: '#B0B0B0',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondary: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#111111',
  },
  modalButtonPrimary: {
    backgroundColor: '#FFFFFF',
  },
  modalButtonSecondaryText: {
    color: '#D2D2D2',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  modalButtonPrimaryText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
});
