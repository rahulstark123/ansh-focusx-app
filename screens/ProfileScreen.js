import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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

function SettingRow({ label }) {
  return (
    <Pressable style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#AFAFAF" />
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const sidePadding = isCompact ? 12 : 16;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.topFixed, { paddingHorizontal: sidePadding }]}>
        <View style={styles.header}>
          <Text style={styles.logo}>FOCUSX</Text>
        </View>

        <View style={[styles.avatar, isCompact && styles.avatarCompact]}>
          <Text style={[styles.avatarLabel, isCompact && styles.avatarLabelCompact]}>JD</Text>
        </View>

        <Text style={[styles.title, isCompact && styles.titleCompact]}>THE PERFORMER</Text>
        <Text style={styles.subtitle}>STATUS OPTIMAL</Text>
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
          <MetricCard title="AVERAGE SESSION" value="52" suffix="m" />
          <MetricCard title="TOTAL SESSIONS" value="124" wide />
        </View>

        <View style={styles.rankCard}>
          <View>
            <Text style={styles.rankLabel}>GLOBAL RANK</Text>
            <Text style={styles.rankValue}>TOP 2%</Text>
          </View>
          <MaterialCommunityIcons name="shield-check" size={26} color="#0B0B0B" />
        </View>

        <Text style={styles.sectionLabel}>PROTOCOLS & CONFIG</Text>

        <SettingRow label="ACCOUNT SETTINGS" />
        <SettingRow label="NOTIFICATION PROTOCOLS" />
        <SettingRow label="MONOLITH SYSTEM PREFERENCES" />
        <SettingRow label="TERMS & CONDITIONS" />
        <SettingRow label="PRIVACY POLICY" />

        <Pressable
          style={styles.logoutRow}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Text style={styles.logoutLabel}>LOGOUT</Text>
          <Ionicons name="log-out-outline" size={18} color="#C99A8A" />
        </Pressable>
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
    fontSize: 22 / 2,
    fontWeight: '700',
    letterSpacing: 0.7,
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
    fontSize: 39 / 2,
    fontWeight: '800',
  },
  avatarLabelCompact: {
    fontSize: 17,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 56 / 2,
    fontWeight: '800',
    letterSpacing: 4.2,
    marginBottom: 1,
  },
  titleCompact: {
    fontSize: 23,
    letterSpacing: 3.2,
  },
  subtitle: {
    color: '#848484',
    textAlign: 'center',
    fontSize: 8,
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
    fontSize: 7.5,
    fontWeight: '700',
    letterSpacing: 1.7,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 54 / 2,
    fontWeight: '700',
  },
  metricSuffix: {
    color: '#9B9B9B',
    fontSize: 10,
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
    fontSize: 7.5,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  rankValue: {
    color: '#000000',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.7,
  },
  sectionLabel: {
    color: '#6E6E6E',
    fontSize: 8,
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
    fontSize: 18 / 2,
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
    fontSize: 17 / 2,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
});
