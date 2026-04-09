import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { apiFetch } from '../utils/api';

export default function WeakScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const [isStopping, setIsStopping] = useState(false);

  const handleStopSession = async () => {
    if (isStopping) {
      return;
    }
    setIsStopping(true);
    try {
      const sessionId = route?.params?.sessionId;
      if (sessionId) {
        await apiFetch(`/sessions/${sessionId}/abandon`, {
          method: 'POST',
        });
      }
    } catch (_error) {
      // Even if API fails, continue UX flow.
    } finally {
      setIsStopping(false);
      navigation.navigate('StreakLost');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { paddingHorizontal: isCompact ? 20 : 28 }]}>
        <View style={styles.topBar}>
          <Text style={styles.topBrand}>FOCUSX</Text>
          <Ionicons name="warning" size={16} color="#FFFFFF" />
        </View>

        <Text style={[styles.title, isCompact && styles.titleCompact]}>ARE YOU{"\n"}WEAK?</Text>

        <Text style={[styles.message, isCompact && styles.messageCompact]}>
          BREAKING THIS SESSION WILL{"\n"}
          RESET YOUR STREAK AND{"\n"}
          REGISTER A FAILED PROTOCOL.
        </Text>

        <View style={[styles.countdownBox, isCompact && styles.countdownBoxCompact]}>
          <Ionicons
            name="lock-closed"
            size={isCompact ? 28 : 32}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.protocolText}>PROTOCOL LOCK ENGAGED</Text>

        <Pressable
          style={[styles.primaryButton, isCompact && styles.primaryButtonCompact]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryLabel}>CONTINUE FOCUS</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryWrap}
          onPress={handleStopSession}
          disabled={isStopping}
        >
          <Text style={styles.secondaryLabel}>{isStopping ? 'STOPPING SESSION...' : 'I AM WEAK, STOP SESSION'}</Text>
          <View style={styles.secondaryUnderline} />
        </Pressable>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 36,
  },
  topBrand: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 66 / 2,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: 34,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 29,
    lineHeight: 31,
  },
  message: {
    color: '#8D8D8D',
    fontSize: 28 / 2,
    fontWeight: '700',
    letterSpacing: 1.1,
    lineHeight: 28 / 2 + 3,
    textAlign: 'center',
    marginTop: 28,
  },
  messageCompact: {
    fontSize: 12,
    marginTop: 22,
  },
  countdownBox: {
    width: 94,
    height: 94,
    borderWidth: 1,
    borderColor: '#5A5A5A',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  countdownBoxCompact: {
    width: 84,
    height: 84,
    marginTop: 42,
  },
  protocolText: {
    color: '#6E6E6E',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 2.8,
    textAlign: 'center',
    marginTop: 14,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 52,
  },
  primaryButtonCompact: {
    marginTop: 44,
    paddingVertical: 14,
  },
  primaryLabel: {
    color: '#161616',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  secondaryWrap: {
    alignItems: 'center',
    marginTop: 28,
  },
  secondaryLabel: {
    color: '#8E8E8E',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryUnderline: {
    width: 186,
    height: 1,
    marginTop: 4,
    backgroundColor: '#606060',
  },
});
