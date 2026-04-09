import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { storageGetItem } from '../utils/storage';

function MetricSection({ label, title, value }) {
  return (
    <View style={styles.metricSection}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const [metrics, setMetrics] = useState({
    totalStartedSessions: 0,
    successfulCompletedSessions: 0,
    failedSessions: 0,
    longestSessionMinutes: 0,
    totalFocusHours: 0,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadAnalytics = async () => {
        try {
          const userId = await storageGetItem('fx_user_id');
          if (!userId) {
            return;
          }
          const analytics = await apiFetch(`/analytics/${userId}`);
          const ranking = await apiFetch(`/rankings/${userId}`);
          if (!active) {
            return;
          }
          setMetrics({
            totalStartedSessions: Number(analytics?.totalStartedSessions || 0),
            successfulCompletedSessions: Number(analytics?.successfulCompletedSessions || 0),
            failedSessions: Number(analytics?.failedSessions || 0),
            longestSessionMinutes: Number(analytics?.longestSessionMinutes || 0),
            totalFocusHours: Number(analytics?.totalFocusHours || 0),
          });
          setLeaderboard(Array.isArray(ranking?.leaderboard) ? ranking.leaderboard.slice(0, 7) : []);
          setCurrentRank(ranking?.currentUserRank || null);
        } catch (_error) {
          if (active) {
            setMetrics({
              totalStartedSessions: 0,
              successfulCompletedSessions: 0,
              failedSessions: 0,
              longestSessionMinutes: 0,
              totalFocusHours: 0,
            });
            setLeaderboard([]);
            setCurrentRank(null);
          }
        }
      };

      loadAnalytics();
      return () => {
        active = false;
      };
    }, [])
  );

  const longestSessionText = useMemo(() => {
    const mins = metrics.longestSessionMinutes;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours <= 0) {
      return `${remMins}m`;
    }
    return `${hours}h ${remMins}m`;
  }, [metrics.longestSessionMinutes]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.topFixed, { paddingHorizontal: isCompact ? 14 : 18 }]}>
        <View style={styles.header}>
          <View style={styles.iconButton} />
          <Text style={styles.brand}>FOCUSX</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.heroWrap}>
          <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>YOUR</Text>
          <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>DISCIPLINE</Text>
          <View style={styles.heroLine} />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: isCompact ? 14 : 18, paddingBottom: 20 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MetricSection
          label="SESSION SUMMARY"
          title="TOTAL FOCUS"
          value={String(metrics.totalStartedSessions)}
        />
        <MetricSection
          label="SESSION SUMMARY"
          title="SUCCESSFUL COMPLETED"
          value={String(metrics.successfulCompletedSessions)}
        />
        <MetricSection
          label="SESSION SUMMARY"
          title="FAILED SESSIONS"
          value={String(metrics.failedSessions)}
        />
        <MetricSection
          label="SESSION SUMMARY"
          title="LONGEST SESSION"
          value={longestSessionText}
        />
        <MetricSection
          label="SESSION SUMMARY"
          title="TOTAL FOCUS HOURS"
          value={`${metrics.totalFocusHours}h`}
        />

        <View style={styles.eliteCard}>
          <View style={styles.eliteLeft}>
            <Text style={styles.eliteHeading}>RANKING STATUS</Text>
            <Text style={styles.eliteBody}>
              {currentRank
                ? `YOU: #${currentRank.rankPosition} • ${currentRank.rankLevel} • ${currentRank.totalFocusHours}h`
                : 'YOU: #0 • INITIATE • 0h'}
            </Text>
          </View>
        </View>

        <View style={styles.rankTable}>
          <Text style={styles.rankTableTitle}>GLOBAL LEADERBOARD (TOP 7)</Text>
          {leaderboard.map((entry) => (
            <View key={entry.userId} style={styles.rankRow}>
              <Text style={styles.rankRowLeft}>{`#${entry.rankPosition}  ${entry.fullName}`}</Text>
              <Text style={styles.rankRowRight}>{`${entry.totalFocusHours}h  •  ${entry.rankLevel}`}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 4,
    paddingBottom: 8,
  },
  contentContainer: {
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroWrap: {
    marginBottom: 34,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: 0.5,
  },
  heroTitleCompact: {
    fontSize: 32,
    lineHeight: 34,
  },
  heroLine: {
    width: 88,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  metricSection: {
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1C',
  },
  metricLabel: {
    color: '#9B9B9B',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 2.7,
    marginBottom: 8,
  },
  metricTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginBottom: 2,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  eliteCard: {
    marginTop: 24,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#202020',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 90,
  },
  eliteLeft: {
    flexShrink: 1,
    paddingRight: 12,
  },
  eliteHeading: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 24,
  },
  eliteBody: {
    color: '#B5B5B5',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 12,
  },
  rankTable: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#202020',
    backgroundColor: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rankTableTitle: {
    color: '#B1B1B1',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  rankRow: {
    minHeight: 34,
    borderTopWidth: 1,
    borderTopColor: '#242424',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankRowLeft: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  rankRowRight: {
    color: '#AFAFAF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
