import { StyleSheet, Text, View } from 'react-native';

function StatBlock({ title, value, isLast, compact }) {
  return (
    <View style={[styles.block, compact && styles.blockCompact, !isLast && styles.blockDivider]}>
      <Text style={[styles.blockTitle, compact && styles.blockTitleCompact]}>{title}</Text>
      <Text style={[styles.blockValue, compact && styles.blockValueCompact]}>{value}</Text>
    </View>
  );
}

export default function StatCard({ compact = false }) {
  return (
    <View style={styles.card}>
      <StatBlock title="CURRENT STREAK" value="Day 7" compact={compact} />
      <StatBlock title="TODAY" value="2h 10m" compact={compact} isLast />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#202020',
    marginTop: 'auto',
    marginBottom: 12,
  },
  block: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 34,
  },
  blockCompact: {
    paddingVertical: 24,
  },
  blockDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#232323',
  },
  blockTitle: {
    color: '#A9A9A9',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 14,
  },
  blockTitleCompact: {
    fontSize: 11,
    marginBottom: 10,
    letterSpacing: 1.6,
  },
  blockValue: {
    color: '#FFFFFF',
    fontSize: 46,
    fontWeight: '700',
  },
  blockValueCompact: {
    fontSize: 36,
  },
});
