import { Ionicons } from '@expo/vector-icons';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { clearAppSession } from '../utils/auth';
import { storageGetItem } from '../utils/storage';
import { supabase } from '../utils/supabase';

function MetricCard({ title, value, suffix, wide }) {
  return (
    <View style={[styles.metricCard, wide && styles.metricCardWide]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>{value}</Text>
        {suffix ? <Text style={styles.metricSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

function SettingRow({ label, onPress }) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#AFAFAF" />
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const POLICY_URL = 'https://focus.anshapps.in';
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const sidePadding = isCompact ? 12 : 16;
  const [userName, setUserName] = useState('USER');
  const [userEmail, setUserEmail] = useState('');
  const [avgSessionMinutes, setAvgSessionMinutes] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentRank, setCurrentRank] = useState(null);
  const [rankLevels, setRankLevels] = useState([]);
  const [showRankModal, setShowRankModal] = useState(false);

  const initials = useMemo(() => {
    const parts = String(userName || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) {
      return 'U';
    }
    return parts
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }, [userName]);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      const localName = await storageGetItem('fx_user_name');
      const userId = await storageGetItem('fx_user_id');
      if (mounted && localName) {
        setUserName(localName);
      }
      if (!userId) {
        return;
      }
      try {
        const [profile, ranking] = await Promise.all([
          apiFetch(`/auth/users/${userId}/profile`),
          apiFetch(`/rankings/${userId}`),
        ]);
        if (!mounted) {
          return;
        }
        setUserName(profile.fullName || localName || 'USER');
        setUserEmail(profile.email || '');
        setAvgSessionMinutes(Number(profile.avgSessionMinutes || 0));
        setTotalSessions(Number(profile.totalSessions || 0));
        setCurrentRank(ranking?.currentUserRank || null);
        setRankLevels(Array.isArray(ranking?.rankLevels) ? ranking.rankLevels : []);
      } catch (_error) {
        // Keep local fallback if API fetch fails.
        if (mounted) {
          setAvgSessionMinutes(0);
          setTotalSessions(0);
          setCurrentRank(null);
          setRankLevels([]);
        }
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) {
      try {
        await apiFetch('/auth/supabase-logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (_error) {
        // Ignore backend sign-out sync failure and continue local sign-out.
      }
    }
    await supabase.auth.signOut();
    await clearAppSession();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const openPolicySite = async () => {
    try {
      await Linking.openURL(POLICY_URL);
    } catch (_error) {
      // Ignore if device cannot open browser.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.topFixed, { paddingHorizontal: sidePadding }]}>
        <Pressable style={styles.rankBadge} onPress={() => setShowRankModal(true)}>
          <Text style={styles.rankBadgeText}>
            {currentRank?.rankLevel || 'INITIATE'}
          </Text>
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.logo}>FOCUSX</Text>
        </View>

        <View style={[styles.avatar, isCompact && styles.avatarCompact]}>
          <Text style={[styles.avatarLabel, isCompact && styles.avatarLabelCompact]}>{initials}</Text>
        </View>

        <Text style={[styles.title, isCompact && styles.titleCompact]}>{userName.toUpperCase()}</Text>
        <Text style={styles.subtitle}>{userEmail || 'STATUS OPTIMAL'}</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingHorizontal: sidePadding,
            paddingBottom: 18 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metricsWrap}>
          <MetricCard title="AVERAGE SESSION" value={String(avgSessionMinutes)} suffix="m" />
          <MetricCard title="TOTAL SESSIONS" value={String(totalSessions)} wide />
        </View>

        <View style={styles.rankCard}>
          <View>
            <Text style={styles.rankLabel}>GLOBAL RANK</Text>
            <Text style={styles.rankValue}>VIEW BOARD</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('GlobalRanking')}>
            <Ionicons name="eye-outline" size={24} color="#0B0B0B" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>PROTOCOLS & CONFIG</Text>

        <SettingRow label="MY PROFILE" onPress={() => navigation.navigate('MyProfile')} />
        <SettingRow label="TERMS & CONDITIONS" onPress={openPolicySite} />
        <SettingRow label="PRIVACY POLICY" onPress={openPolicySite} />
        <SettingRow label="FEEDBACK" onPress={() => navigation.navigate('Feedback')} />

        <Pressable
          style={styles.logoutRow}
          onPress={handleLogout}
        >
          <Text style={styles.logoutLabel}>LOGOUT</Text>
          <Ionicons name="log-out-outline" size={18} color="#C99A8A" />
        </Pressable>
      </ScrollView>

      <Modal transparent visible={showRankModal} animationType="fade" onRequestClose={() => setShowRankModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>RANK SYSTEM</Text>
            {currentRank ? (
              <Text style={styles.modalCurrentRank}>
                {`YOUR RANK: #${currentRank.rankPosition} • ${currentRank.rankLevel} • ${currentRank.totalFocusHours}h`}
              </Text>
            ) : null}
            <View style={styles.modalList}>
              {rankLevels.map((level, index) => (
                <Text key={level} style={styles.modalListItem}>{`${index + 1}. ${level}`}</Text>
              ))}
            </View>
            <Pressable style={styles.modalCloseButton} onPress={() => setShowRankModal(false)}>
              <Text style={styles.modalCloseButtonText}>CLOSE</Text>
            </Pressable>
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
  topFixed: {
    backgroundColor: '#000000',
    paddingTop: 8,
  },
  contentContainer: {
    paddingTop: 8,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  rankBadge: {
    position: 'absolute',
    top: 8,
    right: 0,
    width: 56,
    minHeight: 24,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  avatar: {
    width: 86,
    height: 86,
    alignSelf: 'center',
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarCompact: {
    width: 74,
    height: 74,
    marginBottom: 12,
  },
  avatarLabel: {
    color: '#FFFFFF',
    fontSize: 21.5,
    fontWeight: '800',
  },
  avatarLabelCompact: {
    fontSize: 19,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 4.2,
    marginBottom: 1,
  },
  titleCompact: {
    fontSize: 25,
    letterSpacing: 3.2,
  },
  subtitle: {
    color: '#848484',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 18,
  },
  metricsWrap: {
    gap: 10,
  },
  metricCard: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '56%',
    minHeight: 106,
    justifyContent: 'space-between',
  },
  metricCardWide: {
    width: '100%',
    minHeight: 92,
  },
  metricTitle: {
    color: '#9B9B9B',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.7,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '700',
  },
  metricSuffix: {
    color: '#9B9B9B',
    fontSize: 12,
    marginLeft: 4,
    marginBottom: 4,
    fontWeight: '700',
  },
  rankCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    minHeight: 74,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankLabel: {
    color: '#1A1A1A',
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  rankValue: {
    color: '#000000',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.7,
  },
  sectionLabel: {
    color: '#6E6E6E',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.1,
    marginTop: 18,
    marginBottom: 14,
  },
  settingRow: {
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  logoutRow: {
    marginTop: 14,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutLabel: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  modalCurrentRank: {
    color: '#BFBFBF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 10,
  },
  modalList: {
    borderTopWidth: 1,
    borderTopColor: '#252525',
    paddingTop: 10,
  },
  modalListItem: {
    color: '#E6E6E6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 7,
  },
  modalCloseButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
    minWidth: 90,
    minHeight: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modalCloseButtonText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
