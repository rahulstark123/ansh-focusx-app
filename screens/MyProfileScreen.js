import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import AppPopup from '../components/AppPopup';
import { storageGetItem, storageSetItem } from '../utils/storage';

export default function MyProfileScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rankText, setRankText] = useState('RANK: --');
  const [isSaving, setIsSaving] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: '', message: '' });

  const showPopup = (title, message) => setPopup({ visible: true, title, message });
  const closePopup = () => setPopup((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      const id = await storageGetItem('fx_user_id');
      if (!id) {
        if (mounted) {
          showPopup('Not available', 'Please login again to edit your profile.');
        }
        return;
      }

      if (mounted) {
        setUserId(id);
      }

      try {
        const [profile, ranking] = await Promise.all([
          apiFetch(`/auth/users/${id}/profile`),
          apiFetch(`/rankings/${id}`),
        ]);
        if (!mounted) return;
        setFullName(profile.fullName || '');
        setEmail(profile.email || '');
        const rank = ranking?.currentUserRank;
        if (rank) {
          setRankText(`RANK: #${rank.rankPosition} • ${rank.rankLevel} • ${rank.totalFocusHours}h`);
        }
      } catch (_error) {
        if (mounted) {
          showPopup('Load failed', 'Unable to load profile right now.');
        }
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    const cleanName = fullName.trim();

    if (!userId) {
      showPopup('Not available', 'Please login again.');
      return;
    }
    if (!cleanName) {
      showPopup('Invalid full name', 'Please enter your full name.');
      return;
    }

    try {
      setIsSaving(true);
      const updated = await apiFetch(`/auth/users/${userId}/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName: cleanName,
          email,
        }),
      });
      await storageSetItem('fx_user_name', updated.fullName || cleanName);
      showPopup('Saved', 'Your profile has been updated.');
    } catch (error) {
      const msg = String(error?.message || '').toLowerCase();
      showPopup('Save failed', 'Unable to update profile right now. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            <Text style={styles.backText}>BACK</Text>
          </Pressable>
          <Text style={styles.title}>MY PROFILE</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          placeholder="YOUR NAME"
          placeholderTextColor="#5F5F5F"
          selectionColor="#FFFFFF"
        />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          value={email}
          editable={false}
          style={styles.input}
          placeholder="EMAIL ADDRESS (READ ONLY)"
          placeholderTextColor="#5F5F5F"
          selectionColor="#FFFFFF"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.rankCard}>
          <Text style={styles.rankTitle}>CURRENT STATUS</Text>
          <Text style={styles.rankValue}>{rankText}</Text>
        </View>

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveButtonText}>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</Text>
        </Pressable>
      </View>

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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  label: {
    color: '#8C8C8C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#151515',
    color: '#FFFFFF',
    minHeight: 50,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  rankCard: {
    marginTop: 16,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rankTitle: {
    color: '#8C8C8C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  rankValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  saveButton: {
    marginTop: 26,
    backgroundColor: '#FFFFFF',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#101010',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
});
