import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { syncSupabaseSessionToBackend } from '../utils/auth';
import { supabase } from '../utils/supabase';
import AppPopup from '../components/AppPopup';

export default function SignupScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: '', message: '' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const showPopup = (title, message) => setPopup({ visible: true, title, message });
  const closePopup = () => setPopup((prev) => ({ ...prev, visible: false }));

  const handleSignup = async () => {
    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    if (!payload.fullName) {
      showPopup('Invalid full name', 'Please enter your full name.');
      return;
    }
    if (!payload.email || !emailRegex.test(payload.email)) {
      showPopup('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (!payload.password || payload.password.length < 8) {
      showPopup('Weak password', 'Password must be at least 8 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: { data: { full_name: payload.fullName } },
      });
      if (error) throw error;

      if (!data?.session?.access_token) {
        showPopup('Verify your email', `Verification link sent to ${payload.email}. Please verify, then login.`);
        return;
      }

      await syncSupabaseSessionToBackend({
        fullName: payload.fullName,
        accessToken: data.session.access_token,
      });
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (error) {
      const msg = String(error?.message || '').toLowerCase();
      if (msg.includes('already registered') || msg.includes('email already exists') || msg.includes('signup_conflict')) {
        showPopup('Signup failed', 'This email is already registered. Please login instead.');
      } else if (msg.includes('fullname already exists')) {
        showPopup('Signup failed', 'This full name is already linked to another account.');
      } else if (msg.includes('400') || msg.includes('required')) {
        showPopup('Signup failed', 'Please fill full name, email and password correctly.');
      } else if (msg.includes('email rate limit exceeded')) {
        showPopup('Try again later', 'Too many requests. Please wait and retry.');
      } else {
        showPopup('Signup failed', 'Unable to sign up right now. Please try again.');
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
            <Text style={styles.helpText}>HELP</Text>
          </View>
        </View>

        <Text style={[styles.title, isCompact && styles.titleCompact]}>ENLIST</Text>
        <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
          ENTER THE VOID. ACHIEVE{"\n"}ARCHITECTURAL PRECISION IN YOUR{"\n"}PERFORMANCE.
        </Text>

        <View style={[styles.formWrap, isCompact && styles.formWrapCompact]}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="REQUIRED"
            placeholderTextColor="#5F5F5F"
            selectionColor="#FFFFFF"
          />

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

          <Pressable style={styles.primaryButton} onPress={handleSignup} disabled={isSubmitting}>
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'PLEASE WAIT...' : 'COMMENCE'}</Text>
          </Pressable>

          <Pressable style={styles.secondaryWrap} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.secondaryText}>ALREADY ENLISTED? LOGIN</Text>
            <View style={styles.secondaryUnderline} />
          </Pressable>
        </View>

        <View style={styles.protocolWrap}>
          <View style={styles.protocolLine} />
          <Text style={styles.protocolText}>FOCUSX PROTOCOL</Text>
          <View style={styles.protocolLine} />
        </View>

        <View style={styles.authSwitch}>
          <Pressable style={styles.authTab} onPress={() => navigation.navigate('Login')}>
            <Ionicons name="log-in-outline" size={14} color="#AAAAAA" />
            <Text style={styles.authLabel}>LOGIN</Text>
          </Pressable>
          <View style={[styles.authTab, styles.authTabActive]}>
            <Ionicons name="person-add-outline" size={14} color="#FFFFFF" />
            <Text style={[styles.authLabel, styles.authLabelActive]}>SIGNUP</Text>
          </View>
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
    marginTop: 20,
  },
  formWrapCompact: {
    marginTop: 14,
  },
  label: {
    color: '#8C8C8C',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 8,
    marginTop: 12,
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
    marginTop: 24,
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
    marginTop: 14,
  },
  secondaryText: {
    color: '#A5A5A5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  secondaryUnderline: {
    marginTop: 4,
    width: 164,
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
