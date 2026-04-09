import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SessionCompletedScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const objective = String(route?.params?.objective || 'DEEP WORK');
  const mode = String(route?.params?.mode || 'focus');
  const modeLabel = mode === 'hyper' ? 'HYPER FOCUS' : 'FOCUS';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View
        style={[
          styles.container,
          { paddingHorizontal: isCompact ? 18 : 24, paddingBottom: 22 + insets.bottom },
        ]}
      >
        <View style={styles.headerWrap}>
          <Text style={styles.headerBrand}>FOCUSX</Text>
          <Text style={[styles.title, isCompact && styles.titleCompact]}>CONGRATULATIONS</Text>
          <Text style={styles.subtitle}>YOU SUCCESSFULLY COMPLETED THE SESSION</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsLabel}>OBJECTIVE</Text>
          <Text style={[styles.detailsValue, isCompact && styles.detailsValueCompact]}>
            {objective.toUpperCase()}
          </Text>
          <Text style={styles.modeText}>{modeLabel}</Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('FocusForm')}>
          <Text style={styles.primaryButtonText}>START NEW SESSION</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryWrap}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        >
          <Text style={styles.secondaryText}>BACK TO HOME</Text>
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
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  headerWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerBrand: {
    color: '#6A6A6A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  titleCompact: {
    fontSize: 30,
  },
  subtitle: {
    color: '#9E9E9E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 12,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  detailsLabel: {
    color: '#8D8D8D',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  detailsValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  detailsValueCompact: {
    fontSize: 22,
  },
  modeText: {
    marginTop: 8,
    color: '#AFAFAF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#101010',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  secondaryWrap: {
    alignItems: 'center',
    marginTop: 14,
  },
  secondaryText: {
    color: '#9A9A9A',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  secondaryUnderline: {
    marginTop: 4,
    width: 96,
    height: 1,
    backgroundColor: '#666666',
  },
});
