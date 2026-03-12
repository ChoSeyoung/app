import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1c1c1c',
    background: '#F6F1E8',
    tint: '#ffb928',
    icon: '#1c1c1c',
    tabIconDefault: '#B2A79C',
    tabIconSelected: '#FFFDF8',
    surface: '#F4F3F1',
    surfaceMuted: '#E3DDD5',
    accent: '#ffb928',
    accentSoft: '#F8E6AA',
    border: '#DED9D2',
    success: '#2B8A5A',
    danger: '#B03A2E',
  },
  dark: {
    text: '#F6F4F2',
    background: '#1F1D1F',
    tint: '#ffb928',
    icon: '#B9B3AD',
    tabIconDefault: '#9A948E',
    tabIconSelected: '#FFFDF8',
    surface: '#2A2728',
    surfaceMuted: '#393435',
    accent: '#ffb928',
    accentSoft: '#5A4A1C',
    border: '#474244',
    success: '#63C08A',
    danger: '#FF8D7D',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Pretendard',
    serif: 'Pretendard',
    rounded: 'Pretendard',
    mono: 'Pretendard',
  },
  default: {
    sans: 'Pretendard',
    serif: 'Pretendard',
    rounded: 'Pretendard',
    mono: 'Pretendard',
  },
  web: {
    sans: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    serif: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    rounded: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    mono: "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
  },
});
