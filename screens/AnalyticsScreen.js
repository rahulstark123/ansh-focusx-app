import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.topFixed, { paddingHorizontal: isCompact ? 14 : 18 }]}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="menu" size={18} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.brand}>FOCUSX</Text>
          <Pressable style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={18} color="#FFFFFF" />
          </Pressable>
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
        <MetricSection label="CURRENT PERFORMANCE" title="CURRENT STREAK" value="Day 7" />
        <MetricSection label="HISTORICAL PEAK" title="LONGEST STREAK" value="Day 21" />
        <MetricSection label="ACCUMULATED LABOR" title="TOTAL FOCUS HOURS" value="142h" />

        <View style={styles.eliteCard}>
          <View style={styles.eliteLeft}>
            <Text style={styles.eliteHeading}>ELITE</Text>
            <Text style={styles.eliteHeading}>STATUS:</Text>
            <Text style={styles.eliteHeading}>ACTIVE</Text>
            <Text style={styles.eliteBody}>YOU ARE IN THE TOP 2%</Text>
            <Text style={styles.eliteBody}>OF FOCUSED PERFORMERS</Text>
            <Text style={styles.eliteBody}>TODAY.</Text>
          </View>

          <Pressable style={styles.shareButton}>
            <Text style={styles.shareButtonText}>SHARE</Text>
            <Text style={styles.shareButtonText}>PROGRESS</Text>
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
    fontSize: 22 / 2,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroWrap: {
    marginBottom: 34,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 68 / 2,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  heroTitleCompact: {
    fontSize: 30,
    lineHeight: 32,
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
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 2.7,
    marginBottom: 8,
  },
  metricTitle: {
    color: '#FFFFFF',
    fontSize: 22 / 2,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginBottom: 2,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 76 / 2,
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
    minHeight: 124,
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
  shareButton: {
    backgroundColor: '#FFFFFF',
    minWidth: 104,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  shareButtonText: {
    color: '#111111',
    fontSize: 15 / 2,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: 11,
  },
});
