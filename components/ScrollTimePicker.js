import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

function TimeWheel({ data, value, onChange, itemHeight, textStyle, width }) {
  const listRef = useRef(null);

  const handleMomentumEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    const safeIndex = Math.max(0, Math.min(data.length - 1, index));
    onChange(data[safeIndex]);
    listRef.current?.scrollToOffset({ offset: safeIndex * itemHeight, animated: true });
  };

  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={(item) => String(item)}
      style={{ width }}
      showsVerticalScrollIndicator={false}
      snapToInterval={itemHeight}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({ length: itemHeight, offset: itemHeight * index, index })}
      initialScrollIndex={value}
      onMomentumScrollEnd={handleMomentumEnd}
      renderItem={({ item }) => (
        <View style={[styles.item, { height: itemHeight }]}>
          <Text style={textStyle}>{String(item).padStart(2, '0')}</Text>
        </View>
      )}
    />
  );
}

export default function ScrollTimePicker({ minutes, seconds, onMinutesChange, onSecondsChange, timerSize }) {
  const wheelData = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const displaySize = Math.round(timerSize * 0.82);
  const itemHeight = Math.round(displaySize * 1.1);
  const numberStyle = useMemo(
    () => [
      styles.number,
      {
        fontSize: displaySize,
        lineHeight: Math.round(displaySize * 1.04),
      },
    ],
    [displaySize]
  );

  return (
    <View>
      <View style={styles.arrowRow}>
        <Ionicons name="chevron-up" size={18} color="#7E7E7E" />
        <Ionicons name="chevron-up" size={18} color="#7E7E7E" />
      </View>

      <View style={[styles.wrap, { height: itemHeight }]}>
        <TimeWheel
          data={wheelData}
          value={minutes}
          onChange={onMinutesChange}
          itemHeight={itemHeight}
          textStyle={numberStyle}
          width={Math.round(displaySize * 1.35)}
        />
        <Text style={[styles.colon, { fontSize: displaySize, lineHeight: Math.round(displaySize * 1.04) }]}>:</Text>
        <TimeWheel
          data={wheelData}
          value={seconds}
          onChange={onSecondsChange}
          itemHeight={itemHeight}
          textStyle={numberStyle}
          width={Math.round(displaySize * 1.35)}
        />
      </View>

      <View style={styles.arrowRow}>
        <Ionicons name="chevron-down" size={18} color="#7E7E7E" />
        <Ionicons name="chevron-down" size={18} color="#7E7E7E" />
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.unitLabel}>MIN</Text>
        <Text style={styles.unitLabel}>SEC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    marginBottom: 2,
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  colon: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginHorizontal: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 2,
  },
  unitLabel: {
    color: '#8D8D8D',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
});
