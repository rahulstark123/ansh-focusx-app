import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import {
  THEME_DARK,
  THEME_LIGHT,
  getThemePalette,
  loadThemePreference,
  setThemePreference,
} from '../utils/theme';
const THEME_OPTIONS = [
  { id: 'dark', label: 'DARK MODE', desc: 'Current app visual style.' },
  { id: 'light', label: 'LIGHT MODE', desc: 'Light surfaces and dark text.' },
];

function ThemeOption({ palette, active, label, desc, onPress }) {
  return (
    <Pressable
      style={[
        styles.option,
        { borderColor: palette.border, backgroundColor: palette.surface },
        active && { borderColor: palette.textMuted, backgroundColor: palette.surfaceAlt },
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.optionLabel, { color: palette.text }]}>{label}</Text>
        <Text style={[styles.optionDesc, { color: palette.textMuted }]}>{desc}</Text>
      </View>
      <Ionicons
        name={active ? 'radio-button-on' : 'radio-button-off'}
        size={20}
        color={active ? palette.text : palette.radioInactive}
      />
    </Pressable>
  );
}

export default function ThemeSettingsScreen({ navigation }) {
  const [theme, setTheme] = useState(THEME_DARK);
  const [savedBanner, setSavedBanner] = useState('');
  const palette = getThemePalette(theme);

  useEffect(() => {
    let mounted = true;
    const loadTheme = async () => {
      const saved = await loadThemePreference();
      if (mounted && saved) {
        setTheme(saved);
      }
    };
    loadTheme();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelect = async (nextTheme) => {
    const applied = await setThemePreference(nextTheme);
    setTheme(applied);
    setSavedBanner('Theme preference saved.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={palette.text} />
            <Text style={[styles.backText, { color: palette.text }]}>BACK</Text>
          </Pressable>
          <Text style={[styles.title, { color: palette.text }]}>THEME SETTINGS</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={[styles.subtitle, { color: palette.textMuted }]}>Choose your display theme preference.</Text>

        <View style={styles.optionsWrap}>
          {THEME_OPTIONS.map((option) => (
            <ThemeOption
              key={option.id}
              palette={palette}
              active={theme === option.id}
              label={option.label}
              desc={option.desc}
              onPress={() => handleSelect(option.id)}
            />
          ))}
        </View>

        <Text style={[styles.note, { color: palette.textHint }]}>Changes apply immediately to app container theme.</Text>
        {savedBanner ? <Text style={[styles.saved, { color: palette.textMuted }]}>{savedBanner}</Text> : null}
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 16,
    marginBottom: 14,
    letterSpacing: 0.7,
  },
  optionsWrap: {
    gap: 10,
  },
  option: {
    borderWidth: 1,
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: 13,
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  optionDesc: {
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  note: {
    fontSize: 12,
    marginTop: 18,
    lineHeight: 16,
  },
  saved: {
    fontSize: 12,
    marginTop: 10,
    letterSpacing: 0.6,
  },
});
