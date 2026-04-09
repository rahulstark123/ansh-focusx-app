import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { apiFetch } from '../utils/api';
import { storageGetItem } from '../utils/storage';

const DUMMY_LEADERBOARD = [
  { userId: 'd1', fullName: 'Aarav Mehta', totalFocusHours: 142.5, rankPosition: 1, rankLevel: 'LEGEND' },
  { userId: 'd2', fullName: 'Diya Sharma', totalFocusHours: 121.2, rankPosition: 2, rankLevel: 'TITAN' },
  { userId: 'd3', fullName: 'Kabir Singh', totalFocusHours: 98.4, rankPosition: 3, rankLevel: 'ELITE' },
  { userId: 'd4', fullName: 'Ananya Rao', totalFocusHours: 76.8, rankPosition: 4, rankLevel: 'ADVANCED' },
  { userId: 'd5', fullName: 'Rahul Raj', totalFocusHours: 64.3, rankPosition: 5, rankLevel: 'ADVANCED' },
  { userId: 'd6', fullName: 'Ishaan Verma', totalFocusHours: 39.7, rankPosition: 6, rankLevel: 'FOCUSED' },
  { userId: 'd7', fullName: 'Meera Nair', totalFocusHours: 22.1, rankPosition: 7, rankLevel: 'FOCUSED' },
  { userId: 'd8', fullName: 'Rohan Kapoor', totalFocusHours: 18.6, rankPosition: 8, rankLevel: 'DISCIPLINED' },
  { userId: 'd9', fullName: 'Sana Iqbal', totalFocusHours: 16.2, rankPosition: 9, rankLevel: 'DISCIPLINED' },
  { userId: 'd10', fullName: 'Yash Patil', totalFocusHours: 14.4, rankPosition: 10, rankLevel: 'DISCIPLINED' },
  { userId: 'd11', fullName: 'Neha Arora', totalFocusHours: 11.9, rankPosition: 11, rankLevel: 'DISCIPLINED' },
  { userId: 'd12', fullName: 'Vikram Das', totalFocusHours: 9.8, rankPosition: 12, rankLevel: 'DISCIPLINED' },
];

export default function GlobalRankingScreen() {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentRank, setCurrentRank] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadRanking = async () => {
        try {
          const userId = await storageGetItem('fx_user_id');
          if (!userId) {
            return;
          }
          const ranking = await apiFetch(`/rankings/${userId}?page=${page}&pageSize=10`);
          if (!active) {
            return;
          }
          const liveLeaderboard = Array.isArray(ranking?.leaderboard) ? ranking.leaderboard : [];
          setLeaderboard(liveLeaderboard.length ? liveLeaderboard : DUMMY_LEADERBOARD);
          setTotalPages(Number(ranking?.pagination?.totalPages || 1));
          setCurrentRank(
            ranking?.currentUserRank || {
              userId: 'self',
              fullName: 'You',
              totalFocusHours: 64.3,
              rankPosition: 5,
              rankLevel: 'ADVANCED',
            }
          );
        } catch (_error) {
          if (active) {
            const start = (page - 1) * 10;
            setLeaderboard(DUMMY_LEADERBOARD.slice(start, start + 10));
            setTotalPages(Math.ceil(DUMMY_LEADERBOARD.length / 10));
            setCurrentRank({
              userId: 'self',
              fullName: 'You',
              totalFocusHours: 64.3,
              rankPosition: 5,
              rankLevel: 'ADVANCED',
            });
          }
        }
      };

      loadRanking();
      return () => {
        active = false;
      };
    }, [page])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: isCompact ? 14 : 18, paddingBottom: 20 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>FOCUSX</Text>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>GLOBAL RANKING</Text>
        <View style={styles.titleLine} />

        <View style={styles.youCard}>
          <Text style={styles.youHeading}>YOUR POSITION</Text>
          <Text style={styles.youText}>
            {currentRank
              ? `#${currentRank.rankPosition} • ${currentRank.rankLevel} • ${currentRank.totalFocusHours}h`
              : '#0 • INITIATE • 0h'}
          </Text>
        </View>

        <View style={styles.table}>
          {leaderboard.map((entry) => (
            <View key={entry.userId} style={styles.row}>
              <Text style={styles.rowLeft}>{`#${entry.rankPosition}  ${entry.fullName}`}</Text>
              <Text style={styles.rowRight}>{`${entry.totalFocusHours}h  •  ${entry.rankLevel}`}</Text>
            </View>
          ))}
        </View>

        <View style={styles.paginationWrap}>
          <Pressable
            style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <Text style={styles.pageButtonText}>PREV</Text>
          </Pressable>
          <Text style={styles.pageInfo}>{`PAGE ${page} / ${totalPages}`}</Text>
          <Pressable
            style={[styles.pageButton, page >= totalPages && styles.pageButtonDisabled]}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <Text style={styles.pageButtonText}>NEXT</Text>
          </Pressable>
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
  contentContainer: {
    paddingTop: 8,
  },
  brand: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 31,
  },
  titleLine: {
    width: 100,
    height: 3,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  youCard: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: '#202020',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  youHeading: {
    color: '#9E9E9E',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  youText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  table: {
    borderWidth: 1,
    borderColor: '#242424',
    backgroundColor: '#111111',
  },
  row: {
    minHeight: 40,
    borderTopWidth: 1,
    borderTopColor: '#262626',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rowRight: {
    color: '#B2B2B2',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  paginationWrap: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageButton: {
    minWidth: 82,
    minHeight: 36,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  pageInfo: {
    color: '#B1B1B1',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
