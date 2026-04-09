import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { syncSupabaseSessionToBackend } from '../utils/auth';
import { supabase } from '../utils/supabase';
import AppPopup from '../components/AppPopup';

export default function LoginScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: '', message: '' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const showPopup = (title, message) => setPopup({ visible: true, title, message });
  const closePopup = () => setPopup((prev) => ({ ...prev, visible: false }));

  const handleResendVerification = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      showPopup('Invalid email', 'Enter the same email you used for signup.');
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: cleanEmail,
      });
      if (error) throw error;
      showPopup('Email sent', `Verification link sent to ${cleanEmail}.`);
    } catch (error) {
      showPopup('Could not send email', String(error?.message || 'Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    const payload = {
      email: email.trim().toLowerCase(),
      password,
    };

    if (!payload.email || !emailRegex.test(payload.email)) {
      showPopup('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (!payload.password) {
      showPopup('Missing password', 'Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (error) throw error;
      const accessToken = data?.session?.access_token;
      if (!accessToken) throw new Error('missing_session');
      await syncSupabaseSessionToBackend({ accessToken });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      const code = String(error?.code || '').toLowerCase();
      const msg = String(error?.message || '').toLowerCase();
      if (
        code === 'invalid_credentials' ||
        msg.includes('invalid credential') ||
        msg.includes('invalid login') ||
        msg.includes('email or password')
      ) {
        showPopup('Login failed', 'Incorrect email or password.');
      } else if (msg.includes('email not confirmed') || msg.includes('email_not_confirmed')) {
        showPopup('Verify email first', 'Please verify your email before login. You can resend verification below.');
      } else if (msg.includes('401') || msg.includes('unauthorized')) {
        showPopup('Login failed', 'Could not verify your session. Please try again.');
      } else if (msg.includes('500') || msg.includes('network') || msg.includes('failed to fetch') || msg.includes('aborted')) {
        showPopup('Connection issue', 'Check your internet and try again.');
      } else {
        showPopup('Login failed', 'Unable to login right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <View style={styles.passwordWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[styles.input, styles.passwordInput]}
              placeholder="MIN 8 CHARACTERS"
              placeholderTextColor="#5F5F5F"
              selectionColor="#FFFFFF"
              secureTextEntry={!showPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
            >
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#B2B2B2" />
            </Pressable>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={isSubmitting}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'PLEASE WAIT...' : 'LOGIN'}</Text>
          </Pressable>

          <Pressable style={styles.secondaryWrap} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.secondaryText}>NEW HERE? SIGN UP</Text>
            <View style={styles.secondaryUnderline} />
          </Pressable>
          <Pressable style={styles.secondaryWrap} onPress={handleResendVerification} disabled={isSubmitting}>
            <Text style={styles.secondaryText}>RESEND VERIFICATION EMAIL</Text>
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
      <AppPopup
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
      />
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
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    lineHeight: 20,
    marginTop: 10,
  },
  subtitleCompact: {
    fontSize: 12,
    lineHeight: 18,
  },
  formWrap: {
    marginTop: 26,
  },
  formWrapCompact: {
    marginTop: 20,
  },
  label: {
    color: '#8C8C8C',
    fontSize: 10,
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
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  passwordWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
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
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  secondaryWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryText: {
    color: '#A5A5A5',
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  authLabelActive: {
    color: '#FFFFFF',
  },
});
