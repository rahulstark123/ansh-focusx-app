import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import AppPopup from '../components/AppPopup';
import { apiFetch } from '../utils/api';
import { storageGetItem } from '../utils/storage';

export default function FeedbackScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: '', message: '' });

  const handleSend = async () => {
    const cleanMessage = message.trim();
    if (cleanMessage.length < 5) {
      setPopup({
        visible: true,
        title: 'Feedback too short',
        message: 'Please write at least 5 characters.',
      });
      return;
    }

    try {
      setIsSending(true);
      const userId = await storageGetItem('fx_user_id');
      if (!userId) {
        setPopup({
          visible: true,
          title: 'Unable to send',
          message: 'User not found. Please login again.',
        });
        return;
      }

      await apiFetch('/feedback', {
        method: 'POST',
        body: JSON.stringify({ userId, message: cleanMessage }),
      });

      setPopup({
        visible: true,
        title: 'Feedback sent',
        message: 'Thank you. Your feedback has been submitted.',
      });
      setMessage('');
    } catch (_error) {
      setPopup({
        visible: true,
        title: 'Send failed',
        message: 'Could not send feedback right now. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClosePopup = () => {
    const wasSuccess = popup.title === 'Feedback sent';
    setPopup((prev) => ({ ...prev, visible: false }));
    if (wasSuccess) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View
        style={[
          styles.container,
          { paddingHorizontal: isCompact ? 14 : 18, paddingBottom: 14 + insets.bottom },
        ]}
      >
        <Text style={styles.brand}>FOCUSX</Text>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>FEEDBACK</Text>
        <Text style={styles.subtitle}>Tell us what can be improved.</Text>

        <TextInput
          style={styles.input}
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
          placeholder="Write your feedback..."
          placeholderTextColor="#676767"
          selectionColor="#FFFFFF"
          maxLength={1000}
        />

        <Pressable style={styles.sendButton} onPress={handleSend} disabled={isSending}>
          <Text style={styles.sendButtonText}>{isSending ? 'SENDING...' : 'SEND'}</Text>
        </Pressable>
      </View>

      <AppPopup
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        onClose={handleClosePopup}
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
    paddingTop: 8,
  },
  brand: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginTop: 22,
  },
  titleCompact: {
    fontSize: 30,
    marginTop: 16,
  },
  subtitle: {
    color: '#8B8B8B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#0F0F0F',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sendButton: {
    marginTop: 14,
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#101010',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
});
