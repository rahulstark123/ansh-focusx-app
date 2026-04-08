import { Pressable, StyleSheet, Text } from 'react-native';

export default function FocusButton({ title, onPress, compact = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, compact && styles.buttonCompact]}>
      <Text style={[styles.label, compact && styles.labelCompact]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    paddingVertical: 12,
    paddingHorizontal: 36,
  },
  label: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  labelCompact: {
    fontSize: 16,
    letterSpacing: 0.7,
  },
});
