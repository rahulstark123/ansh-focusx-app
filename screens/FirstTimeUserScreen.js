import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../utils/api';

export default function FirstTimeUserScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const [fullName, setFullName] = useState('');

  const handleContinue = async () => {
    const cleanName = fullName.trim();
    if (!cleanName) {
      return;
    }

    let user;
    try {
      user = await apiFetch('/users/create', {
        method: 'POST',
        body: JSON.stringify({ fullName: cleanName }),
      });
    } catch (_error) {
      user = await apiFetch('/auth/name-login', {
        method: 'POST',
        body: JSON.stringify({ fullName: cleanName }),
      });
    }

    await AsyncStorage.setItem('fx_user_id', user.id);
    await AsyncStorage.setItem('fx_user_name', user.fullName);

    if (user.firstTime) {
      await apiFetch('/auth/complete-first-time', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      });
    }

    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={[styles.container, { paddingHorizontal: isCompact ? 12 : 18 }]}>
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

          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>CONTINUE</Text>
          </Pressable>
        </View>
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
    paddingTop: 4,
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
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  helpText: {
    color: '#B2B2B2',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginTop: 34,
  },
  titleCompact: {
    marginTop: 24,
  },
  subtitle: {
    color: '#838383',
    fontSize: 13.5,
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
    marginTop: 28,
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
});
