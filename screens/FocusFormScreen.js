import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function FocusFormScreen({ navigation }) {
  const [objective, setObjective] = useState('');
  const [mode, setMode] = useState('focus');
  const [showInfo, setShowInfo] = useState(false);
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390 || height < 800;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={[styles.container, { paddingHorizontal: isCompact ? 20 : 28 }]}>
        <Text style={[styles.objectiveTitle, isCompact && styles.objectiveTitleCompact]}>
          SESSION OBJECTIVE
        </Text>

        <TextInput
          value={objective}
          onChangeText={setObjective}
          placeholder="e.g. Deep Work"
          placeholderTextColor="#777777"
          style={[styles.input, isCompact && styles.inputCompact]}
          selectionColor="#FFFFFF"
        />

        <View style={styles.modeHeader}>
          <Text style={styles.modeTitle}>MODE</Text>
          <Pressable onPress={() => setShowInfo(true)} style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={18} color="#B8B8B8" />
          </Pressable>
        </View>

        <View style={styles.modeSwitch}>
          <Pressable
            style={[styles.modeTab, mode === 'focus' && styles.modeTabActive]}
            onPress={() => setMode('focus')}
          >
            <Text style={[styles.modeTabLabel, mode === 'focus' && styles.modeTabLabelActive]}>FOCUS</Text>
          </Pressable>
          <Pressable
            style={[styles.modeTab, mode === 'hyper' && styles.modeTabActive]}
            onPress={() => setMode('hyper')}
          >
            <Text style={[styles.modeTabLabel, mode === 'hyper' && styles.modeTabLabelActive]}>HYPER FOCUS</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.beginButton, isCompact && styles.beginButtonCompact]}
          onPress={() => navigation.navigate('ActiveSession')}
        >
          <Text style={[styles.beginLabel, isCompact && styles.beginLabelCompact]}>BEGIN</Text>
        </Pressable>

        <Pressable
          style={styles.cancelWrap}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
        >
          <Text style={styles.cancelLabel}>CANCEL</Text>
          <View style={styles.cancelUnderline} />
        </Pressable>
      </View>

      <Modal transparent visible={showInfo} animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>FOCUS MODES</Text>

            <Text style={styles.modalHeading}>Focus mode</Text>
            <Text style={styles.modalBody}>
              You can minimize the app and the countdown will continue.
            </Text>

            <Text style={[styles.modalHeading, styles.modalHeadingGap]}>Hyper Focus mode</Text>
            <Text style={styles.modalBody}>
              Phone becomes silent and minimize is not allowed. You must quit session to stop.
            </Text>

            <Pressable style={styles.modalClose} onPress={() => setShowInfo(false)}>
              <Text style={styles.modalCloseText}>GOT IT</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
  },
  objectiveTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 26,
  },
  objectiveTitleCompact: {
    fontSize: 16,
    marginBottom: 20,
    letterSpacing: 3.2,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 30 / 2,
    fontWeight: '500',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A4A4A',
    marginBottom: 40,
  },
  inputCompact: {
    marginBottom: 30,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modeTitle: {
    color: '#B5B5B5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  infoButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeSwitch: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101010',
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
  },
  modeTabLabel: {
    color: '#A2A2A2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  modeTabLabelActive: {
    color: '#111111',
  },
  beginButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  beginButtonCompact: {
    paddingVertical: 13,
  },
  beginLabel: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  beginLabelCompact: {
    fontSize: 16,
  },
  cancelWrap: {
    alignItems: 'center',
    marginTop: 20,
  },
  cancelLabel: {
    color: '#9A9A9A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cancelUnderline: {
    marginTop: 4,
    width: 34,
    height: 1,
    backgroundColor: '#7F7F7F',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  modalHeading: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  modalHeadingGap: {
    marginTop: 10,
  },
  modalBody: {
    color: '#B1B1B1',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  modalClose: {
    marginTop: 14,
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalCloseText: {
    color: '#111111',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
