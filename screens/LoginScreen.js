import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function LoginScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: isCompact ? 12 : 18, paddingBottom: 10 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View style={styles.topSideButton} />
          <Text style={styles.topBrand}>FOCUSX</Text>
          <View style={styles.topSideButton}>
            <Text style={styles.helpText}>HELP</Text>
          </View>
        </View>

        <Text style={[styles.title, isCompact && styles.titleCompact]}>LOGIN</Text>
        <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
          RETURN TO THE GRID. RESUME YOUR{"\n"}DISCIPLINE PROTOCOL.
        </Text>

        <View style={[styles.formWrap, isCompact && styles.formWrapCompact]}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="USER@DOMAIN.EXT"
            placeholderTextColor="#5F5F5F"
            selectionColor="#FFFFFF"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="MIN 8 CHARACTERS"
            placeholderTextColor="#5F5F5F"
            selectionColor="#FFFFFF"
            secureTextEntry
          />

          <Pressable style={styles.primaryButton} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}>
            <Text style={styles.primaryButtonText}>LOGIN</Text>
          </Pressable>

          <Pressable style={styles.secondaryWrap} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.secondaryText}>NEW HERE? SIGN UP</Text>
            <View style={styles.secondaryUnderline} />
          </Pressable>
        </View>

        <View style={styles.protocolWrap}>
          <View style={styles.protocolLine} />
          <Text style={styles.protocolText}>FOCUSX PROTOCOL</Text>
          <View style={styles.protocolLine} />
        </View>

        <View style={styles.authSwitch}>
          <View style={[styles.authTab, styles.authTabActive]}>
            <Ionicons name="log-in-outline" size={14} color="#FFFFFF" />
            <Text style={[styles.authLabel, styles.authLabelActive]}>LOGIN</Text>
          </View>
          <Pressable style={styles.authTab} onPress={() => navigation.navigate('Signup')}>
            <Ionicons name="person-add-outline" size={14} color="#AAAAAA" />
            <Text style={styles.authLabel}>SIGNUP</Text>
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
    paddingTop: 4,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSideButton: {
    width: 56,
    height: 26,
    justifyContent: 'center',
  },
  topBrand: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  helpText: {
    color: '#B2B2B2',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 62 / 2,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginTop: 22,
  },
  titleCompact: {
    marginTop: 16,
  },
  subtitle: {
    color: '#838383',
    fontSize: 23 / 2,
    fontWeight: '700',
    letterSpacing: 1.1,
    lineHeight: 18,
    marginTop: 10,
  },
  subtitleCompact: {
    fontSize: 10,
    lineHeight: 16,
  },
  formWrap: {
    marginTop: 26,
  },
  formWrapCompact: {
    marginTop: 20,
  },
  label: {
    color: '#8C8C8C',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#151515',
    color: '#FFFFFF',
    minHeight: 50,
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  primaryButton: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#101010',
    fontSize: 16 / 2,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  secondaryWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryText: {
    color: '#A5A5A5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  secondaryUnderline: {
    marginTop: 4,
    width: 140,
    height: 1,
    backgroundColor: '#5A5A5A',
  },
  protocolWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  protocolLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  protocolText: {
    color: '#767676',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.4,
    marginHorizontal: 10,
  },
  authSwitch: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
  },
  authTab: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0E0E',
    gap: 8,
  },
  authTabActive: {
    backgroundColor: '#1A1A1A',
  },
  authLabel: {
    color: '#AAAAAA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  authLabelActive: {
    color: '#FFFFFF',
  },
});
