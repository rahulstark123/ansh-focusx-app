import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppPopup({ visible, title, message, buttonText = 'OK', onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  message: {
    color: '#B0B0B0',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    alignSelf: 'flex-end',
    minWidth: 88,
    minHeight: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
});
