/**
 * 주간 달력 공통 컴포넌트.
 *
 * 역할:
 * - 홈과 기록/식단 계열 화면에서 동일한 주간 선택 버블 UI를 재사용한다.
 * - 날짜 선택 상태와 점 표시만 입력으로 받아 화면별 로직과 분리한다.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

export type WeekCalendarItem = {
  key: string;
  dayLabel: string;
  dateLabel: string | number;
  isActive?: boolean;
};

type WeekCalendarProps = {
  items: WeekCalendarItem[];
  accentColor: string;
  dayColor: string;
  onPressItem?: (item: WeekCalendarItem) => void;
};

export function WeekCalendar({
  items,
  accentColor,
  dayColor,
  onPressItem,
}: WeekCalendarProps) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <Pressable
          key={item.key}
          style={styles.item}
          onPress={() => onPressItem?.(item)}
          hitSlop={6}>
          <Text style={[styles.dayLabel, { color: dayColor }]}>{item.dayLabel}</Text>
          <View
            style={[
              styles.dateBubble,
              { backgroundColor: item.isActive ? accentColor : '#FFFFFF' },
            ]}>
            <Text style={styles.dateLabel}>{item.dateLabel}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
    paddingHorizontal: 2,
  },
  dayLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  dateBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: Fonts.sans,
    fontWeight: '500',
    fontSize: 16,
    color: '#1A1A1A',
  },
});
