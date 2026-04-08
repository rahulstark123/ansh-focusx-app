import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function StatRow({ label, value, isLast }) {
  return (
    <View style={[styles.statRow, isLast && styles.statRowLast]}>
      <View style={styles.statBar} />
      <View style={styles.statTextWrap}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function StreakLostScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View
        style={[
          styles.container,
          { paddingHorizontal: isCompact ? 20 : 28, paddingBottom: 52 + insets.bottom },
        ]}
      >
        <View style={styles.headerBox}>
          <Text style={styles.headerBrand}>FOCUSX</Text>
          <View style={[styles.xBox, isCompact && styles.xBoxCompact]}>
            <Ionicons name="close" size={isCompact ? 36 : 42} color="#FFFFFF" />
          </View>
        </View>

        <Text style={[styles.heroMain, isCompact && styles.heroMainCompact]}>YOU BROKE YOUR WORD</Text>
        <Text style={styles.heroSub}>STREAK LOST.</Text>

        <View style={styles.midFill}>
          <View style={styles.statsBlock}>
            <StatRow label="PREVIOUS PEAK" value="42 DAYS" />
            <StatRow label="CURRENT RESET" value="0 DAYS" isLast />
          </View>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerLabel}>INTEGRITY LEVEL</Text>
            <Text style={styles.footerCompromised}>COMPROMISED</Text>
          </View>
          <View style={styles.auditWrap}>
            <View style={styles.auditDot} />
            <Text style={styles.auditText}>AUDIT COMPLETE</Text>
          </View>
        </View>

        <Pressable
          style={[styles.cta, isCompact && styles.ctaCompact]}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        >
          <Text style={styles.ctaLabel}>START AGAIN</Text>
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
  headerBox: {
    alignItems: 'center',
    marginTop: 8,
  },
  headerBrand: {
    color: '#3A3A3A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  xBox: {
    width: 88,
    height: 88,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xBoxCompact: {
    width: 76,
    height: 76,
  },
  heroMain: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.8,
    lineHeight: 34,
    textAlign: 'center',
    marginTop: 28,
  },
  heroMainCompact: {
    fontSize: 26,
    lineHeight: 30,
  },
  heroSub: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 6,
    textAlign: 'center',
    marginTop: 10,
  },
  midFill: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
  },
  statsBlock: {
    marginTop: 0,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 28,
  },
  statRowLast: {
    marginBottom: 0,
  },
  statBar: {
    width: 2,
    backgroundColor: '#FFFFFF',
    marginRight: 14,
  },
  statTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  statLabel: {
    color: '#7A7A7A',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 6,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  footerLabel: {
    color: '#6E6E6E',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  footerCompromised: {
    color: '#C94A4A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  auditWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  auditDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#6E6E6E',
  },
  auditText: {
    color: '#6E6E6E',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: 6,
  },
  cta: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  ctaCompact: {
    paddingVertical: 14,
  },
  ctaLabel: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});
