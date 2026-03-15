/**
 * 광고 슬롯 공통 카드.
 *
 * 역할:
 * - 정보형 화면에서 광고를 디자인 시스템 톤 안에 담는 컨테이너 역할을 한다.
 * - Expo Go에서는 플레이스홀더를, 네이티브 런타임에서는 실제 배너를 보여준다.
 *
 * 유지보수 포인트:
 * - 실제 광고 단위 ID 교체 시 테스트 ID와 운영 ID 분기 규칙을 명확히 유지해야 한다.
 */
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GOOGLE_TEST_BANNER_UNIT_ID } from '@/constants/ads';
import { t } from '@/constants/i18n';
import { Spacing } from '@/constants/spacing';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AdSlotCardProps = {
  title?: string;
  body?: string;
  tone?: 'paper' | 'cream' | 'blush' | 'lavender';
};

const toneMap = {
  paper: '#FFFCF6',
  cream: '#EEEAD6',
  blush: '#F4D7D0',
  lavender: '#DCD4F3',
} as const;

export function AdSlotCard({
  title = t('starterGuideScreen.adTitle'),
  body = t('starterGuideScreen.adBody'),
  tone = 'paper',
}: AdSlotCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const isExpoGo = Constants.appOwnership === 'expo';
  const [BannerAdComponent, setBannerAdComponent] = useState<null | ((props: { unitId: string; size: string }) => any)>(null);
  const [bannerSize, setBannerSize] = useState('ANCHORED_ADAPTIVE_BANNER');
  const [adUnitId, setAdUnitId] = useState(GOOGLE_TEST_BANNER_UNIT_ID);

  useEffect(() => {
    if (isExpoGo) return;

    void import('react-native-google-mobile-ads')
      .then(({ BannerAd, BannerAdSize, TestIds }) => {
        setBannerAdComponent(() => BannerAd as unknown as (props: { unitId: string; size: string }) => any);
        setBannerSize(BannerAdSize.ANCHORED_ADAPTIVE_BANNER);
        setAdUnitId(__DEV__ ? TestIds.BANNER : GOOGLE_TEST_BANNER_UNIT_ID);
      })
      .catch(() => {
        setBannerAdComponent(null);
      });
  }, [isExpoGo]);

  return (
    <View style={[styles.card, { backgroundColor: toneMap[tone], borderColor: theme.border }]}>
      <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
        <Text style={[styles.badgeText, { color: theme.text }]}>{t('starterGuideScreen.adBadge')}</Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.icon }]}>{body}</Text>
      {isExpoGo || !BannerAdComponent ? (
        <View style={[styles.placeholder, { borderColor: theme.border, backgroundColor: '#FFF9EE' }]}>
          <Text style={[styles.placeholderText, { color: theme.icon }]}>{t('starterGuideScreen.adPlaceholder')}</Text>
        </View>
      ) : (
        <View style={[styles.bannerWrap, { borderColor: theme.border, backgroundColor: '#FFF9EE' }]}>
          <BannerAdComponent unitId={adUnitId} size={bannerSize} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.cardPadding,
    gap: 10,
    overflow: 'hidden',
    shadowColor: '#C9B8A4',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.chipRadius,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  placeholder: {
    minHeight: 72,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bannerWrap: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: 8,
  },
  placeholderText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
});
